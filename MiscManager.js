const index = require('./index.js')

module.exports = class MiscManager
{
    client
    moduleName
    moduleDescription
    commands

    constructor(client)
    {
        this.client = client
        this.moduleName = "Misc"
        this.moduleDescription = "Miscellaneous commands"
        this.commands = [this.help, this.uptime]
        console.log("MiscManager loaded!")
    }

    help(message, info)
    {
        let helpString = "*Categories:*\n"
        for (let i = 0; i < index.modules.length; i++)
        {
            helpString += `\n*${index.modules[i].moduleName}*\n${index.modules[i].moduleDescription}\n`
            helpString += `*Commands:* `
            for (let j = 0; j < index.modules[i].commands.length; j++)
                helpString += `${index.modules[i].commands[j].name}, `
            helpString += `\n`
        }
        message.reply(helpString)
    }

    uptime(message, info)
    {
        let uptime = process.uptime()
        let uptimeString = ""
        let days = Math.floor(uptime / 86400)
        let hours = Math.floor(uptime / 3600)
        let minutes = Math.floor(uptime / 60)
        let seconds = Math.floor(uptime % 60)
        if (days > 0)
            uptimeString += `${days} days `
        if (hours > 0)
            uptimeString += `${hours} hours `
        if (minutes > 0)
            uptimeString += `${minutes} minutes `
        uptimeString += `${seconds} seconds`
        message.reply(uptimeString)
        console.log(index.cock)
    }
}