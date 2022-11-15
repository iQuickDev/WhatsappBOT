const { Client, LocalAuth } = require('whatsapp-web.js')
const fs = require('fs')
const OmegleManager = require('./helpers/OmegleManager.js')
const ListManager = require('./helpers/ListManager.js')
const ServerManager = require('./modules/ServerManager.js')
const scheduler = require('node-schedule')
const QRCode = require('qrcode-terminal')
const config = require('./config.json')
let commands = []
// dynamically import all commands
fs.readdirSync('./commands')
	.filter((file) => file.endsWith('.js'))
	.forEach((file) => {
		let cmd = require('./commands/' + file)
		commands.push(cmd)
		console.info(`${file} was loaded`)
	})

//todo: put scheduler group IDs in dotenv, add polls command

exports.commands = commands

const client = new Client({
	authStrategy: new LocalAuth(),
	puppeteer: { handleSIGINT: false },
})

exports.client = client

const Server = new ServerManager()
exports.server = Server

const Omegle = new OmegleManager()
exports.omegle = Omegle

const List = new ListManager()
exports.list = List

client.on('qr', (qr) => QRCode.generate(qr, { small: true }))

client.on('ready', () => {
	console.log('Successfully logged in!')
})

client.on('message_create', (message) => {
	parseMessage(message)
})

client.initialize()

// scheduler.scheduleJob('1 0 * * *', async () =>
// {
//     modules[modules.indexOf(Admin)].clearpanini(null, true) // clearpanini
//     client.sendMessage('393914783047-1599835416@g.us', modules[modules.indexOf(Utility)].schedule(null, {args: ['i']}, true)) // it
//     client.sendMessage('393776703932-1600426162@g.us', modules[modules.indexOf(Utility)].schedule(null, {args: ['t']}, true)) // telecom
// })

async function parseMessage(message) {
	let info = {
		isInGroup: false,
		isCommand: false,
		isSelf: false,
		content: '',
		sender: '',
		group: '',
		command: {
			name: '',
			args: [],
			flags: [],
		},
	}
	if (message.body.toLowerCase().startsWith(`${config.prefix} `)) {
		info.isCommand = true

		// analyze message by splitting it into an array with " " as separator
		let arrayMsgContent = message.body.split(' ')
		// set name of the command
		info.command.name = arrayMsgContent[1]

		// set the arguments of the command
		for (let i = 2; i < arrayMsgContent.length; i++) {
			info.command.args.push(arrayMsgContent[i])
		}
	}

	if (message.fromMe) info.isSelf = true

	info.sender = message.from
	info.content = message.body

	message.getChat().then((chat) => {
		if (chat.isGroup) {
			info.isInGroup = true
			info.group = chat.name
		}
	})

	console.log(info)

	if (info.isCommand) {
		try {
			commands
				.find((cmd) => cmd.name == info.command.name)
				.execute(message, info.command)
		} catch (error) {
			message.reply(error)
		}
	}
}

process.on('SIGINT', async () => {
	console.log('\n[SIGINT] Quitting...')
	await this.client.destroy()
	process.exit(0)
})
