const index = require('../index.js')
const config = require('../config.json')
const sandwiches = require('../sandwiches.json')

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
        this.commands = [this.purge, this.massmention, this.renamegroup, this.mutegroup, this.unmutegroup, this.allowpermissions, this.restrictpermissions, this.invite, this.clearpanini]
        console.log("AdminManager loaded!")
    }

    async purge(message, info)
    {
        if (await isAdmin(message))
        {
            let purgeString = new String('\n')
            
            for (let i = 0; i < 6; i++)
            {
                purgeString += purgeString
            }

            message.reply(purgeString)
        }
        else
        message.reply("Only administrators are allowed to use this command!")
    }

    async massmention(message)
    {
        if (await isAdmin(message))
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

    async renamegroup(message, info)
    {
        if (await isAdmin(message))
        {
            let chat = await message.getChat()

            if (chat.isGroup)
            {
                try
                {
                    chat.setSubject(info.args[0])
                    message.reply(`Chat has been renamed to *${info.args[0]}*`)
                }
                catch (error)
                {
                    message.reply(error)
                }
            }
            else
            message.reply("This command can only be used in a group")
        }
        else
        message.reply(`Only administrators are allowed to use this command!`)
    }

    async setdescription(message, info)
    {
        if (await isAdmin(message))
        {
            let chat = await message.getChat()

            if (chat.isGroup)
            {
                chat.setDescription(info.args[0])
                message.reply(`Description has been set to *${info.args[0]}*`)
            }
            else
            message.reply("This command can only be used in a group")
        }
        else
        message.reply(`Only administrators are allowed to use this command!`)
    }

    async invite(message)
    {
        if (await isAdmin(message))
        {
            let chat = await message.getChat()

            if (chat.isGroup)
            {
                chat.getInviteCode().then(code => message.reply(`https://chat.whatsapp.com/${code}`))
            }
        }
        else
        message.reply(`Only administrators are allowed to use this command!`)
    }

    async restrictpermissions(message)
    {
        if (await isAdmin(message))
        {
            let chat = await message.getChat()

            if (chat.isGroup)
            {
                chat.setInfoAdminsOnly(true)
            }
        }
        else
        message.reply(`Only administrators are allowed to use this command!`)
    }

    async allowpermissions(message)
    {
        if (await isAdmin(message))
        {
            let chat = await message.getChat()

            if (chat.isGroup)
            {
                chat.setInfoAdminsOnly(false)
            }
        }
        else
        message.reply(`Only administrators are allowed to use this command!`)
    }

    async mutegroup(message)
    {
        if (await isAdmin(message))
        {
            let chat = await message.getChat()

            if (chat.isGroup)
            {
                chat.setMessagesAdminsOnly(true)
            }
        }
        else
        message.reply(`Only administrators are allowed to use this command!`)
    }

    async unmutegroup(message)
    {
        if (await isAdmin(message))
        {
            let chat = await message.getChat()

            if (chat.isGroup)
            {
                chat.setMessagesAdminsOnly(false)
            }
        }
        else
        message.reply(`Only administrators are allowed to use this command!`)
    }

    async clearpanini(message, isAutomated = false)
    {
        if (!isAutomated)
        {
            if (await isAdmin(message))
            {
                sandwiches.orders = []
    
                message.reply("Panini list has been cleared")
            }
            else
            message.reply("Only administrators are allowed to use this command!")
        }
        else
        sandwiches.orders = []
    }
}

async function isAdmin(message)
{
    let chat = await message.getChat()
    let admin = false
    if (chat.isGroup) 
    {
        for (let participant of chat.participants)
        {
            if (participant.isAdmin && participant.id._serialized === message.from)
            {
                admin = true
            }
        }
    }
    return admin 
}
