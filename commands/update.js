const config = require('../config.json')

module.exports = {
    name: 'update',
    description: 'update the bot to the latest version',
    category: 'Reserved',
    execute: (message, info) => {
        if (isDev(message))
        {
            message.reply(`Update started, current version: ${config.version}`)
            exec("git stash && git stash drop && git pull && npm install && pm2 restart all", (error, stdout, stderr) =>
            {
                if (error)
                {
                    message.reply(error)
                    return
                }
                if (stderr)
                {
                    message.reply(stderr)
                    return
                }
                message.reply(stdout)
            })
        }
        else
        message.reply("Only developers are allowed to use this command!")
    }
}

function isDev(message) {
    return message.fromMe
}