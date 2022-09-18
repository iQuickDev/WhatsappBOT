const sandwiches = require('../sandwiches.json')
const index = require('../index')
module.exports = {
    name: 'panini',
    description: 'shows a list of panini',
    category: 'NSFW',
    execute: async (message, info) =>
    {
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
            sandwichesString += `${sandwich.name} - ${sandwich.price.toFixed(2)} €\n`
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

            sandwichesString += `\nPaid: ${sandwichorder.paid} € | Change: ${sandwichorder.change.toFixed(2)} €\n\n`

            total += sandwiches.list.find(x => x.name == sandwichorder.name[0]).price
            totalChange += sandwichorder.change
        }

        sandwichesString += `\n*TOTAL*: ${total.toFixed(2)} €\n*TOTAL CHANGE*: ${totalChange.toFixed(2)} €`

        await chat.sendMessage(sandwichesString, { mentions })
    }
}