module.exports = class AdminManager
{
    client
    moduleName
    moduleDescription
    commands

    constructor(client)
    {
        this.client = client
        this.moduleName = "Admin"
        this.moduleDescription = "Administrator reserved commands"
        this.commands = [this.eval, this.purge]
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
}