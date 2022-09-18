const index = require('../index')
const sandwiches = require('../sandwiches.json')

module.exports = {
    name: 'panino',
    description: 'add a panino into the list',
    category: 'NSFW',
    execute: async (message, info) => {
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

        index.commands.find(cmd => cmd.name == 'panini').execute(message, info)
    }
}