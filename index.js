const { Client } = require('whatsapp-web.js')
const NSFWManager = require("./NSFWManager.js")
const AdminManager = require("./AdminManager.js")
const MiscManager = require('./MiscManager.js')
const GameManager = require('./GameManager.js')
const ServerManager = require('./ServerManager.js')
const UtilityManager = require('./UtilityManager.js')
const FileSystem = require('fs')
const QRCode = require('qrcode-terminal')
const config = require('./config.json')

let session = null

try
{
    session = JSON.parse(FileSystem.readFileSync('./session.json'))
    console.log('Session recovered successfully!')
} catch (error) { console.log('No session found, please login') }

const client = new Client({
    session: session
})

const Server = new ServerManager()
exports.server = Server

var modules = []
exports.modules = modules

const NSFW = new NSFWManager(client)
const Admin = new AdminManager(client)
const Misc = new MiscManager(client)
const Utility = new UtilityManager(client)
//const Game = new GameManager(client)

modules.push(NSFW, Admin, Misc, Utility, /*Game*/)

client.on('qr', (qr) => QRCode.generate(qr, { small: true }))

client.on('ready', () =>
{
    console.log("Successfully logged in!")
})

client.on('authenticated', (session) =>
{
    FileSystem.writeFileSync('./session.json', JSON.stringify(session, null, 2))
})

client.on('message_create', message =>
{
    parseMessage(message)
})

client.initialize()

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