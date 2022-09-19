const index = require('../index.js')
const config = require('../config.json')
const { io } = require('socket.io-client')
const OmegleManager = require('../omegle/OmegleManager')
const request = require('request')
const JSDOM = require('jsdom').JSDOM
const jwPlayerScraper = require('jwplayer-scraper')

module.exports = class MiscManager {
	client
	moduleName
	moduleDescription
	commands

	constructor() {
		this.client = index.client
		this.moduleName = 'Misc'
		this.moduleDescription = 'Miscellaneous commands'
		this.commands = [
			this.help,
			this.uptime,
			this.igprofile,
			this.animeinfo,
			this.streamanime,
			this.fakeidentity,
			this.omegle,
			this.version,
		]
		console.log('MiscManager loaded!')
	}

	async streamanime(message, info) {
		if (!info.args[0]) {
			message.reply(
				'Please provide a link from https://gogoplay1.com or https://animelove.tv'
			)
			return
		}

		let link = info.args[0]

		let streamInfo = {
			title: null,
			source: null,
		}

		if (link.includes('gogoplay1.com')) {
			request(link, (error, response, body) => {
				const dom = new JSDOM(response.body)
				streamInfo.title = dom.window.document
					.getElementsByTagName('h1')
					.item(0).textContent
			})

			var sources = await jwPlayerScraper.getMediaSources(link)

			try {
				streamInfo.source = sources[sources.length - 1].file
			} catch (err) {
				message.reply(err.toString())
				return
			}
		} else if (link.includes('animelove.tv')) {
			request(link, async (error, response, body) => {
				const dom = new JSDOM(await response.body)
				streamInfo.title = dom.window.document
					.getElementsByTagName('h1')
					.item(0).textContent
				streamInfo.source = dom.window.document
					.querySelector('source')
					.getAttribute('src')
			})
		}

		if (index.server.isRunning) index.server.updateStream(streamInfo)
		else index.server.start(6969, streamInfo)

		message.reply('Stream started at http://iquickdev.ddns.net:6969')
	}

	async omegle(message, info) {
		let group = await message.getChat()
		console.log(group)

		let omegle = new OmegleManager()

		let socket = io('http://127.0.0.1:10831').connect()

		socket.on('receivedMessage', (msg) => {
			this.client.sendMessage(group, msg)
		})

		this.client.on('message_create', async (msg) => {
			await message.getChat().then((chat) => {
				if (chat.id._serialized == group) socket.emit('sendMessage', msg.body)
			})
		})
	}
}
