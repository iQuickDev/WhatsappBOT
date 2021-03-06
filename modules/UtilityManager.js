const request = require('request')
const google = require('googlethis');
const moment = require('moment')
const schedule = require('../schedule.json')
const index = require('../index.js')
const sandwiches = require('../sandwiches.json');
const { MessageMedia } = require('whatsapp-web.js');


module.exports = class UtilityManager {
    client
    moduleName
    moduleDescription
    commands

    constructor() {
        this.client = index.client
        this.moduleName = "Utility"
        this.moduleDescription = "Useful commands"
        this.commands = [this.image, this.decimaltobinary, this.binarytodecimal, this.decimaltohex, this.hextodecimal, this.asciitodecimal, this.decimaltoascii, this.getrequest, this.covid, this.schedule, this.panini, this.panino]
        console.log("UtilityManager loaded!")
    }

    image(message, info) {
        google.image(info.args[0], { safe: false, hl: 'it' })
            .then((res) => {
                let request = require('request').defaults({ encoding: null })
                request.get(res[0].url, function (error, response, body) {
                    if (!error && response.statusCode == 200) {
                        let data = Buffer.from(body).toString('base64')
                        message.reply(new MessageMedia('image/jpeg', data))
                    }
                })
            }).catch(() => message.reply("*REJECTED*: No results found"))
    }

    decimaltobinary(message, info) {
        message.reply(`${parseInt(info.args[0]).toString(2)}`)
    }

    binarytodecimal(message, info) {
        message.reply(`${parseInt(info.args[0], 2)}`)
    }

    decimaltohex(message, info) {
        message.reply(`${parseInt(info.args[0]).toString(16)}`)
    }

    hextodecimal(message, info) {
        message.reply(`${parseInt(info.args[0], 16)}`)
    }

    asciitodecimal(message, info) {
        if (info.args[0].length > 1) {
            message.reply("Too many characters, please enter just one")
            return
        }

        message.reply(`${info.args[0].charCodeAt(0)}`)
    }

    decimaltoascii(message, info) {
        message.reply(`${String.fromCharCode(parseInt(info.args[0]))}`)
    }

    async getrequest(message, info) {
        await request(info.args[0], function (error, response, body) { message.reply(body) })
    }

    async covid(message, info) {
        await request("https://corona.lmao.ninja/v2/countries/italy", function (error, response, body) {
            let covid = JSON.parse(body)
            message.reply(`*COVID STATS FOR ITALY*\n*Updated*: ${new Date(covid.updated).toLocaleString(undefined, { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', hour12: false, minute: '2-digit', second: '2-digit' })}\n*Active*: ${covid.active}\n*Cases (today)*: ${covid.todayCases}\n*Deaths (today)*: ${covid.todayDeaths}\n*Recovered (today)*: ${covid.todayRecovered}`)
        })
    }

    schedule(message, info, isAutomatic = false) {
        let result = new String()
        let currentDate = new Date()
        let timestamp = `${currentDate.getHours().toString().length < 2 ? '0' + currentDate.getHours().toString() : currentDate.getHours().toString()}:${currentDate.getMinutes().toString().length < 2 ? '0' + currentDate.getMinutes().toString() : currentDate.getMinutes().toString()}`
        let ranges = []
        let timeLeft = new moment()

        let args = info.args[0].split(' ')
        let classType = args[0]
        let day = args[1] == null ? currentDate.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase() : args[1]
        let timeNow = moment(args[2], 'HH:mm').isValid() ? moment(args[2], 'HH:mm') : moment(timestamp, 'HH:mm')

        if (day == 'saturday' || day == 'sunday') {
            message.reply(`The school is closed on ${day}`)
            return
        }

        for (let i = 0; i < schedule.it.length; i++) {
            ranges.push({ start: moment(schedule.it[i].range.substring(0, 5), 'HH:mm'), end: moment(schedule.it[i].range.substring(8, 13), 'HH:mm') })
        }

        if (classType == 'i' || classType == 'info' || classType == 'informatica' || classType == 'it')
            classType = 'it'
        else if (classType == 't' || classType == 'tele' || classType == 'telecom' || classType == 'telecomunicazioni')
            classType = 'telecom'
        else {
            message.reply('Please specify a class (i/t)\nSyntax: wp schedule <class> <day> (optional) <time> (optional)')
            return
        }

        result += `*${day}*\n\n`.toUpperCase()

        for (let i = 0; i < schedule.it.length; i++) // previous, current, next subject and time left till end of class
        {
            if (timeNow.isBetween(ranges[i].start, ranges[i].end)) {
                timeLeft = moment(ranges[i].end).diff(timeNow, 'minutes')

                if (i == 0)
                    result += `Previous: /\nCurrent: ${schedule[classType][i].subjects[day]}\nNext: ${schedule[classType][i + 1].subjects[day]}`
                else if (i > 0 && i < schedule.it.length)
                    result += `Previous: ${schedule[classType][i - 1].subjects[day]}\nCurrent: ${schedule[classType][i].subjects[day]}\nNext: ${schedule[classType][i + 1].subjects[day]}`
                else
                    result += `Previous: ${schedule[classType][i - 1].subjects[day]}\nCurrent: ${schedule[classType][i].subjects[day]}\nNext: /`

                result += `\n\n*Time till next class*: ${timeLeft} minutes\n`
            }
        }

        result += `\n*Schedule:*\n`

        for (let i = 0; i < schedule.it.length; i++) // list all subjects in that day
        {
            if (schedule[classType][i].subjects[day] != null)
                result += `[${i + 1}??] (${schedule[classType][i].range}) ${schedule[classType][i].subjects[day]}\n`
            if (i == 2 || i == 4)
                result += `----- INTERVALLO -----\n`
        }

        result = result.replaceAll('undefined', '/')

        if (isAutomatic)
            return result
        else
            message.reply(result)
    }

    async panino(message, info) {
        if (info.args[0] == '') {
            message.reply(`*Syntax*: wp panino <name>,<alternative> <paid money> (alternatives are unlimited)\n*Example*: wp panino crf,tonno 3`)
            return
        }

        let args = info.args[0].replaceAll(', ', ',').split(',')
        let sandwichNames = new Array()
        let givenMoney = 0
        let change = 0
        let author = await message.getContact()

        for (let i = 0; i < args.length; i++) {
            sandwichNames.push(args[i].replace(/ [0-9]/g, '').toLowerCase())
        }

        console.log(sandwichNames)

        try {
            givenMoney = info.args[0].match(/\d+/g)[0]
        }
        catch (error) {
            givenMoney = sandwiches.list.find(x => x.name == sandwichNames[0]).price
        }

        try {
            change = givenMoney - sandwiches.list.find(x => x.name == sandwichNames[0]).price
        }
        catch (error) {
            message.reply('*REJECTED*: Please specify a valid panino and amount of money')
            return
        }

        let order =
        {
            customer: author,
            name: sandwichNames,
            paid: givenMoney,
            change: change
        }

        if (change < 0) {
            message.reply("*REJECTED*: You don't have enough money")
            return
        }

        for (let i = 0; i < sandwichNames.length - 1; i++) {
            if (sandwiches.list.find(x => x.name == sandwichNames[i]).price != sandwiches.list.find(x => x.name == sandwichNames[i + 1]).price) {
                message.reply("*REJECTED*: your alternatives don't have the same price")
                return
            }
        }

        sandwiches.orders.push(order)

        index.modules[3].panini(message, info)
    }

    async panini(message, info) {
        let chat = await message.getChat()
        let mentions = []
        let total = 0
        let totalChange = 0

        for (const sandwichorder of sandwiches.orders) {
            for (const participant of chat.participants) {
                if (sandwichorder.customer.id.user == participant.id.user) {
                    const contact = await index.client.getContactById(participant.id._serialized)
                    mentions.push(contact)
                }
            }
        }

        let sandwichesString = new String('*PANINI LIST*\n')

        for (const sandwich of sandwiches.list) {
            sandwichesString += `${sandwich.name} - ${sandwich.price.toFixed(2)} ???\n`
        }

        sandwichesString += `\n*ORDERS*\n`

        for (const sandwichorder of sandwiches.orders) {
            sandwichesString += `@${sandwichorder.customer.id.user}`

            for (let i = 0; i < sandwichorder.name.length; i++) {
                if (i == 0)
                    sandwichesString += `: ${sandwichorder.name[i].toUpperCase()}`
                else
                    sandwichesString += ` or ${sandwichorder.name[i].toUpperCase()}`
            }

            sandwichesString += `\nPaid: ${sandwichorder.paid} ??? | Change: ${sandwichorder.change.toFixed(2)} ???\n\n`

            total += sandwiches.list.find(x => x.name == sandwichorder.name[0]).price
            totalChange += sandwichorder.change
        }

        sandwichesString += `\n*TOTAL*: ${total.toFixed(2)} ???\n*TOTAL CHANGE*: ${totalChange.toFixed(2)} ???`

        await chat.sendMessage(sandwichesString, { mentions })
    }
}
