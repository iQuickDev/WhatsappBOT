module.exports = {
    name: 'cocksize',
    description: 'get a representation of your cock',
    category: 'NSFW',
    execute: (message, info) =>
    {
        let phoneNumber

        if (message.author != undefined)
            phoneNumber = message.author.replace(/\D/g,'').slice(2, 12)
        else
            phoneNumber = message.from.replace(/\D/g,'').slice(2, 12)

        let cockSize = 1

        for (let i = 0; i < phoneNumber.length; i++)
        {
            cockSize += parseInt(phoneNumber[i])
        }
    
        cockSize = Math.ceil((cockSize * parseInt(phoneNumber[phoneNumber.length -1]) / ((parseInt(phoneNumber[1]) + 3) * 3)))

        let cockString = '8'

        for (let i = 0; i < cockSize; i++)
        {
            cockString += '='
        }
        cockString += 'D'

        message.reply(`Your cock looks like this:\n${cockString}`)
    }
}