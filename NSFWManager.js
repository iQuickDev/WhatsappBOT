const booru = require('booru')
const request = require('request').defaults({ encoding: null })
const wikifeet = require('wikifeet-js')
const pornhub = require('@justalk/pornhub-api')
const waifu = require("waifu.pics.js")
const { MessageMedia } = require('whatsapp-web.js')

module.exports = class NSFWManager
{
    client
    moduleName
    moduleDescription
    commands

    constructor(client)
    {
        this.client = client
        this.moduleName = "NSFW"
        this.moduleDescription = "Explicit content"
        this.commands = [this.pornhub, this.r34, this.feet, this.waifu, this.cocksize]
        console.log("NSFWManager loaded!")
    }

    async pornhub(message, info)
    {
        let videos = await pornhub.search(info.args[0])
        let randomVideo = videos.results[Randomizer(videos.results.length)]
        console.log(randomVideo)
        message.reply(`*Title*: ${randomVideo.title}\n*Author:* ${randomVideo.author}\n*Views*: ${Math.round(randomVideo.views)}\n*URL*: ${randomVideo.link}`)
    }

    r34(message, info)
    {
        booru.search("rule34", [`${info.args[0]}`], { limit: 1, random: true }).then(posts =>
        {
            if (posts[0] == undefined)
            {
                message.reply("No results found")
                return
            }
            else
            {
                request.get(posts[0].fileUrl, function (error, response, body)
                {
                    if (!error && response.statusCode == 200)
                    {
                        let data = Buffer.from(body).toString('base64')
                        const media = new MessageMedia("image/png", data)
                        message.reply(media)
                    }
                })
            }
        })
    }

    async feet(message, info)
    {
        let model = (await wikifeet.search(info.args[0]))[0]
        if (model == undefined && model == null)
        {
            message.reply("The given name doesn't match any pictures")
            return
        }
        let feetPics = await wikifeet.getImages(model)
        request.get(feetPics[Randomizer(feetPics.length)], function (error, response, body)
        {
            if (!error && response.statusCode == 200)
            {
                let data = Buffer.from(body).toString('base64')
                const media = new MessageMedia("image/png", data)
                message.reply(media)
            }
        })
    }

    async waifu(message, info)
    {
        await waifu().then(data =>
        {
            let image = data.files[Randomizer(data.files.length)]

            request.get(image, function (error, response, body)
            {
                if (!error && response.statusCode == 200)
                {
                    let data = Buffer.from(body).toString('base64')
                    const media = new MessageMedia("image/png", data)
                    message.reply(media)
                }
            })
        }).catch(err => (message.reply(err.toString())))
    }

    cocksize(message, info)
    {
        let randomSize = Randomizer(16)
        let cockString = '8'
        for (let i = 0; i < randomSize; i++)
        {
            cockString += '='
        }
        cockString += 'D'

        message.reply(`Your cock looks like this:\n${cockString}`)
    }
}

function Randomizer(max)
{
    return Math.floor(Math.random() * max);
}