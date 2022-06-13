const { Client, LocalAuth } = require('whatsapp-web.js')
const NSFWManager = require("./modules/NSFWManager.js")
const AdminManager = require("./modules/AdminManager.js")
const MiscManager = require('./modules/MiscManager.js')
const GameManager = require('./modules/GameManager.js')
const ServerManager = require('./modules/ServerManager.js')
const UtilityManager = require('./modules/UtilityManager.js')
const MediaManager = require('./modules/MediaManager.js')
const ReservedManager = require('./modules/ReservedManager.js')
const scheduler = require('node-schedule')
const QRCode = require('qrcode-terminal')
const config = require('./config.json')

const client = new Client({
    authStrategy: new LocalAuth(),
    puppeteer: { handleSIGINT: false}
})

exports.client = client

const Server = new ServerManager()
exports.server = Server

var modules = []
exports.modules = modules

const NSFW = new NSFWManager()
const Admin = new AdminManager()
const Misc = new MiscManager()
const Utility = new UtilityManager()
const Media = new MediaManager()
const Reserved = new ReservedManager()
//const Game = new GameManager()

modules.push(NSFW, Admin, Misc, Utility, Media, Reserved, /*Game*/)

client.on('qr', (qr) => QRCode.generate(qr, { small: true }))

client.on('ready', () =>
{
    console.log("Successfully logged in!")
})

client.on('message_create', message =>
{
    parseMessage(message)
})

client.initialize()

// scheduler.scheduleJob('1 0 * * *', async () =>
// {
//     modules[modules.indexOf(Admin)].clearpanini(null, true) // clearpanini
//     client.sendMessage('393914783047-1599835416@g.us', modules[modules.indexOf(Utility)].schedule(null, {args: ['i']}, true)) // it
//     client.sendMessage('393776703932-1600426162@g.us', modules[modules.indexOf(Utility)].schedule(null, {args: ['t']}, true)) // telecom
// })

async function parseMessage(message)
{
    let info =
    {
        isInGroup: false,
        isCommand: false,
        isSelf: false,
        content: "",
        sender: "",
        group: "",
        command: {
            name: "",
            args: [],
            flags: []
        }
    }

    if (message.body.toLowerCase().startsWith(`${config.prefix} `))
    {
        info.isCommand = true
        info.command.name = message.body.substring(config.prefix.length).split(" ")[1]
        info.command.args.push(message.body.substring(config.prefix.length + info.command.name.length + 2))
    }

    if (message.fromMe)
        info.isSelf = true

    info.sender = message.from
    info.content = message.body

    await message.getChat().then(chat =>
    {
        if (chat.isGroup)
        {
            info.isInGroup = true
            info.group = chat.name
        }
    })

    console.log(info)

    if (info.isCommand)
    {
        for (let i = 0; i < modules.length; i++)
        {
            for (let j = 0; j < modules[i].commands.length; j++)
            {
                if (info.command.name == modules[i].commands[j].name)
                {
                    modules[i].commands[j](message, info.command)
                    return
                }
            }
        }
    }
}

process.on('SIGINT', async () => {
    console.log('\n[SIGINT] Quitting...');
    await this.client.destroy();
    process.exit(0);
});