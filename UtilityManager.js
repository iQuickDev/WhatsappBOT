const request = require('request')

module.exports = class UtilityManager
{
    client
    moduleName
    moduleDescription
    commands

    constructor(client)
    {
        this.client = client
        this.moduleName = "Utility"
        this.moduleDescription = "Useful commands"
        this.commands = [this.decimaltobinary, this.binarytodecimal, this.decimaltohex, this.hextodecimal, this.asciitodecimal, this.decimaltoascii, this.getrequest, this.covid]
        console.log("UtilityManager loaded!")
    }

    decimaltobinary(message, info)
    {
        message.reply(`${parseInt(info.args[0]).toString(2)}`)
    }

    binarytodecimal(message, info)
    {
        message.reply(`${parseInt(info.args[0], 2)}`)
    }

    decimaltohex(message, info)
    {
        message.reply(`${parseInt(info.args[0]).toString(16)}`)
    }

    hextodecimal(message, info)
    {
        message.reply(`${parseInt(info.args[0], 16)}`)
    }

    asciitodecimal(message, info)
    {
        if (info.args[0].length > 1)
        {
            message.reply("Too many characters, please enter just one")
            return
        }

        message.reply(`${info.args[0].charCodeAt(0)}`)
    }

    decimaltoascii(message, info)
    {
        message.reply(`${String.fromCharCode(parseInt(info.args[0]))}`)
    }

    async getrequest(message, info)
    {
        await request(info.args[0], function(error, response, body) {message.reply(body)})
    }

    async covid(message, info)
    {
        await request("https://corona.lmao.ninja/v2/countries/italy", function(error, response, body)
        {
            let covid = JSON.parse(body)
            message.reply(`*COVID STATS FOR ITALY*\n*Updated*: ${new Date(covid.updated).toLocaleString(undefined, {year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute:'2-digit', second:'2-digit'})}\n*Active*: ${covid.active}\n*Cases (today)*: ${covid.todayCases}\n*Deaths (today)*: ${covid.todayDeaths}\n*Recovered (today)*: ${covid.todayRecovered}`)
        })
    }
}