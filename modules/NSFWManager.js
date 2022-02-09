const booru = require('booru')
const request = require('request').defaults({ encoding: null })
const wikifeet = require('wikifeet-js')
const pornhub = require('@justalk/pornhub-api')
const waifu = require("waifu.pics.js")
const { MessageMedia } = require('whatsapp-web.js')
const index = require('../index.js')
const blasphemyPhrases = require('../blasphemy.json')

module.exports = class NSFWManager
{
    client
    moduleName
    moduleDescription
    commands

    constructor()
    {
        this.client = index.client
        this.moduleName = "NSFW"
        this.moduleDescription = "Explicit content"
        this.commands = [this.pornhub, this.r34, this.feet, this.waifu, this.cocksize, this.blasphemy]
        console.log("NSFWManager loaded!")
    }

    async pornhub(message, info)
    {
        let videos = await pornhub.search(info.args[0])
        let randomVideo = videos.results[Randomizer(videos.results.length)]
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

    blasphemy(message, info)
    {
        if (Randomizer(25) == 20)
        {
            message.reply(blasphemyPhrases.specials[Randomizer(blasphemyPhrases.specials.length - 1)])
            return
        }

        if (Randomizer(2))
        {
            message.reply(`${blasphemyPhrases.males[Randomizer(blasphemyPhrases.males.length - 1)]} ${blasphemyPhrases.male_words[Randomizer(blasphemyPhrases.male_words.length - 1)]}`)
        }
        else
        {
            message.reply(`${blasphemyPhrases.females[Randomizer(blasphemyPhrases.males.length - 1)]} ${blasphemyPhrases.female_words[Randomizer(blasphemyPhrases.female_words.length - 1)]}` )
        }
    }
}

function Randomizer(max)
{
    return Math.floor(Math.random() * max);
}
