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
        this.commands = [this.eval]
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
}