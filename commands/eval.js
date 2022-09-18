module.exports = {
    name: 'eval',
    description: 'evaluate js code',
    category: 'Reserved',
    execute: (message, info) => {
        if (isDev(message))
        {
            try
            {
                message.reply(eval(info.args[0]).toString())
                return
            }
            catch (error) { message.reply(error.toString()) }
        }
        else
        message.reply("Only developers are allowed to use this command!")
    }
}

function isDev(message) {
    return message.fromMe
}