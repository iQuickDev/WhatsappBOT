const waifu = require("waifu.pics.js")

module.exports = {
    name: 'waifu',
    description: 'fetch a waifu picture',
    category: 'NSFW',
    execute: (message, info) => {
        waifu().then(data => {
            let image = data.files[Randomizer(data.files.length)]

            request.get(image, function (error, response, body) {
                if (!error && response.statusCode == 200) {
                    let data = Buffer.from(body).toString('base64')
                    const media = new MessageMedia("image/png", data)
                    message.reply(media)
                }
            })
        }).catch(err => (message.reply(err.toString())))
    }
}

function Randomizer(max) {
    return Math.floor(Math.random() * max)
}
