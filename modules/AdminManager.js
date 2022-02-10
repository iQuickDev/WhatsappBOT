const index = require('../index.js')
const config = require('../config.json')
const { exec } = require('child_process')

module.exports = class AdminManager
{
    client
    moduleName
    moduleDescription
    commands

    constructor()
    {
        this.client = index.client
        this.moduleName = "Admin"
        this.moduleDescription = "Administrator reserved commands"
        this.commands = [this.eval, this.purge, this.massmention, this.update]
        console.log("AdminManager loaded!")
    }

    eval(message, info)
    {
        if (message.fromMe)
        {
            try
            {
                message.reply(eval(info.args[0]).toString())
                return
            }
            catch (error) { message.reply(error.toString()) }
        }
        else
        message.reply("Only administrators are allowed to use this command!")
    }

    purge(message, info)
    {
        if (message.fromMe)
        {
            let purgeString
            
            for (let i = 0; i < 100; i++)
            {
                purgeString += '\n'
            }

            message.reply(purgeString)
        }
        else
        message.reply("Only administrators are allowed to use this command!")
    }

    async massmention(message, info)
    {
        if (message.fromMe)
        {
            let chat = await message.getChat()
            let mentions = []
    
            if (chat.isGroup)
            {
                let participants = chat.participants
                let mentionString = "*MASS MENTION REQUESTED*\n"
    
                for (const participant of participants)
                {
                    let contact = await index.client.getContactById(participant.id._serialized)
                    mentions.push(contact)
                    mentionString += `@${participant.id.user} `
                }
    
                chat.sendMessage(mentionString, { mentions })
            }
        }
        else
        message.reply("Only administrators are allowed to use this command!")
    }

    update(message, info)
    {
        if (message.fromMe)
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
        message.reply("Only administrators are allowed to use this command!")
    }

}