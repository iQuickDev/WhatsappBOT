const {exec} = require('child_process')

module.exports = {
    name: 'cmd',
    description: 'run a command on the host machine',
    category: 'Reserved',
    execute: (message, info) => {
        if (isDev(message)) {
            exec(info.args[0], (error, stdout, stderr) => {
                if (error) {
                    message.reply(error)
                    return
                }
                if (stderr) {
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