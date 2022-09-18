const config = require('../config.json')

module.exports = {
    name: 'eval',
    description: 'evaluate js code',
    category: 'Reserved',
    execute: (message, info) => {
        message.reply(`WhatsappBOT ${config.version}${process.arch != 'arm' ? '-dev' : '-stable'}`)
    }
}