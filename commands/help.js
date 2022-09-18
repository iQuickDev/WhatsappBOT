const index = require('../index')
const config = require('../config.json')
module.exports = {
    name: 'help',
    description: 'display a help message',
    category: 'Utility',
    execute: (message, info) =>
    {
        let helpString = "*Commands:*\n"
        for (const cmd of index.commands) {
            helpString += cmd.name + ' '
        }

        helpString += `\n*Syntax*: wp <command> <arguments> (optional)\n`
        helpString += `\nWhatsappBOT ${config.version}${process.arch != 'arm' ? '-dev' : '-stable'}`

        message.reply(helpString)
    }
}