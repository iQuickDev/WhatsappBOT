const index = require('../index.js')
const {exec} = require('child_process')

module.exports = class ReservedManager
{
    client
    moduleName
    moduleDescription
    commands

    constructor()
    {
        this.client = index.client
        this.moduleName = "Reserved"
        this.moduleDescription = "Developer reserved commands"
        this.commands = [this.eval, this.update, this.cmd]
        console.log("ReservedManager loaded!")
    }

    eval(message, info)
    {
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

    update(message, info)
    {
        if (isDev(message))
        {
            message.reply(`Update started, current version: ${config.version}`)
            exec("git pull && npm install && pm2 restart all", (error, stdout, stderr) =>
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

    cmd(message, info)
    {
        if (isDev(message))
        {
            exec(info.args[0], (error, stdout, stderr) =>
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

function isDev(message)
{
    if (message.fromMe)
    {
        return true
    }
    else
    {
        return false
    }
}