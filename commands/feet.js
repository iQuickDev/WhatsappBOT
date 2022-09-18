const wikifeet = require('wikifeet-js')
const request = require('request').defaults({ encoding: null })
module.exports = {
    name: 'feet',
    description: 'fetch a feet picture from wikifeet',
    category: 'NSFW',
    execute: async (message, info) => {
        let model = (await wikifeet.search(info.args[0]))[0]
        if (model == undefined && model == null) {
            message.reply("The given name doesn't match any pictures")
            return
        }
        let feetPics = await wikifeet.getImages(model)
        request.get(feetPics[Randomizer(feetPics.length)], function (error, response, body) {
            if (!error && response.statusCode == 200) {
                let data = Buffer.from(body).toString('base64')
                const media = new MessageMedia("image/png", data)
                message.reply(media)
            }
        })
    }
}

function Randomizer(max) {
    return Math.floor(Math.random() * max)
}