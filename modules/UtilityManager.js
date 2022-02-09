const request = require('request')
const moment = require('moment')
const schedule = require('../schedule.json')
const index = require('../index.js')

module.exports = class UtilityManager
{
    client
    moduleName
    moduleDescription
    commands

    constructor()
    {
        this.client = index.client
        this.moduleName = "Utility"
        this.moduleDescription = "Useful commands"
        this.commands = [this.decimaltobinary, this.binarytodecimal, this.decimaltohex, this.hextodecimal, this.asciitodecimal, this.decimaltoascii, this.getrequest, this.covid, this.schedule]
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
        await request(info.args[0], function (error, response, body) { message.reply(body) })
    }

    async covid(message, info)
    {
        await request("https://corona.lmao.ninja/v2/countries/italy", function (error, response, body)
        {
            let covid = JSON.parse(body)
            message.reply(`*COVID STATS FOR ITALY*\n*Updated*: ${new Date(covid.updated).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' })}\n*Active*: ${covid.active}\n*Cases (today)*: ${covid.todayCases}\n*Deaths (today)*: ${covid.todayDeaths}\n*Recovered (today)*: ${covid.todayRecovered}`)
        })
    }

    schedule(message, info)
    {
        let result = new String()
        let currentDate = new Date()
        let timestamp = `${currentDate.getHours().toString().length < 2 ? '0' + currentDate.getHours().toString() : currentDate.getHours().toString()}:${currentDate.getMinutes().toString().length < 2 ? '0' + currentDate.getMinutes().toString() : currentDate.getMinutes().toString()}`
        let ranges = []

        let args = info.args[0].split(' ')
        let classType = args[0]
        let day = args[1] == null ? currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() : args[1]
        let timeNow = moment(args[2], 'HH:mm').isValid() ? moment(args[2], 'HH:mm') : moment(timestamp, 'HH:mm')

        if (day == 'saturday' || day == 'sunday')
        {
            message.reply(`The school is closed on ${day}`)
            return
        }

        for (let i = 0; i < schedule.it.length; i++)
        {
            ranges.push({ start: moment(schedule.it[i].range.substring(0, 5), 'HH:mm'), end: moment(schedule.it[i].range.substring(8, 13), 'HH:mm') })
        }

        if (classType == 'i' || classType == 'info' || classType == 'informatica' || classType == 'it')
            classType = 'it'
        else if (classType == 't' || classType == 'tele' || classType == 'telecom' || classType == 'telecomunicazioni')
            classType = 'telecom'
        else
        {
            message.reply('Please specify a class (i/t)\nSyntax: wp schedule <class> <day> (optional) <time> (optional)')
            return
        }

        result += `*${day}*\n`.toUpperCase()

        for (let i = 0; i < schedule.it.length; i++) // previous, current and next subject
        {
            if (timeNow.isBetween(ranges[i].start, ranges[i].end))
            {
                if (i == 0)
                result += `Previous: /\nCurrent: ${schedule[classType][i].subjects[day]}\nNext: ${schedule[classType][i + 1].subjects[day]}`
                else if (i > 0 && i < schedule.it.length)
                result += `Previous: ${schedule[classType][i - 1].subjects[day]}\nCurrent: ${schedule[classType][i].subjects[day]}\nNext: ${schedule[classType][i + 1].subjects[day]}`
                else
                result += `Previous: ${schedule[classType][i - 1].subjects[day]}\nCurrent: ${schedule[classType][i].subjects[day]}\nNext: /`
            }
        }

        result += `\n*Schedule:*\n`

        for (let i = 0; i < schedule.it.length; i++) // list all subjects in that day
        {
            if (schedule[classType][i].subjects[day] != null)
            result += `[${i + 1}°] (${schedule[classType][i].range}) ${schedule[classType][i].subjects[day]}\n`
            if (i == 2 || i == 4)
            result += `----- INTERVALLO -----\n`
        }

        result = result.replaceAll('undefined', '/')

        message.reply(result)
    }
}
