const index = require('./index.js')
const igScraper = require('scraper-instagram')
const myAnimeList = require('mal-scraper')
const fakeId = require('fake-identity')
const request = require('request')
const JSDOM = require('jsdom').JSDOM
const jwPlayerScraper = require('jwplayer-scraper')
const scraperClient = new igScraper()

module.exports = class MiscManager
{
    client
    moduleName
    moduleDescription
    commands

    constructor(client)
    {
        this.client = client
        this.moduleName = "Misc"
        this.moduleDescription = "Miscellaneous commands"
        this.commands = [this.help, this.uptime, this.igprofile, this.animeinfo, this.streamanime, this.fakeidentity]
        console.log("MiscManager loaded!")
    }

    help(message, info)
    {
        let helpString = "*Categories:*\n"
        for (let i = 0; i < index.modules.length; i++)
        {
            helpString += `\n*${index.modules[i].moduleName}*\n${index.modules[i].moduleDescription}\n`
            helpString += `*Commands:* `
            for (let j = 0; j < index.modules[i].commands.length; j++)
                helpString += `${index.modules[i].commands[j].name}, `
            helpString += `\n`
        }
        message.reply(helpString)
    }

    uptime(message, info)
    {
        let uptime = process.uptime()
        let uptimeString = ""
        let days = Math.floor(uptime / 86400)
        let hours = Math.floor(uptime / 3600)
        let minutes = Math.floor(uptime / 60)
        let seconds = Math.floor(uptime % 60)
        if (days > 0)
            uptimeString += `${days} days `
        if (hours > 0)
            uptimeString += `${hours} hours `
        if (minutes > 0)
            uptimeString += `${minutes} minutes `
        uptimeString += `${seconds} seconds`
        message.reply(uptimeString)
    }

    async igprofile(message, info)
    {
        await scraperClient.getProfile(info.args[0]).then(profile =>
        {
            message.reply(`*Username*: ${info.args[0]}\n*Full Name*: ${profile.name}\n*Posts*: ${profile.posts}\n*Followers/Following*: ${profile.followers}/${profile.following}\n*Biography*: ${profile.bio}\n*Website*: ${profile.website}\n*Profile picture*: ${profile.pic}\n*Profile link*: ${profile.link}`)
        }).catch(err => message.reply(err.toString()))
    }

    async animeinfo(message, info)
    {
        await myAnimeList.getInfoFromName(info.args[0]).then(info =>
        {
            message.reply(`*Title ENG/JAP*: ${info.englishTitle}/${info.japaneseTitle}\n*Description*: ${info.synopsis}\n*Episodes*: ${info.episodes}\n*Aired*: ${info.aired}\n*Score*: ${info.score}\n*Link*: ${info.url}`)
        }).catch(err => message.reply(err.toString()))
    }

    fakeidentity(message, info)
    {
        let id = fakeId.generate()
        message.reply(`*First name*: ${id.firstName}\n*Last name*: ${id.lastName}\n*Email*: ${id.emailAddress}\n*Phone*: ${id.phoneNumber}\n*Street*: ${id.street}\n*City*: ${id.city}\n*Zip*: ${id.zipCode}\n*Date of birth*: ${id.dateOfBirth}\n*Gender*: ${id.sex}\n*Company*: ${id.company}\n*Department*: ${id.department}`)
    }

    async streamanime(message, info)
    {
        if (!info.args[0])
        {
            message.reply('Please provide a link from https://gogoplay1.com')
            return
        }

        index.server.stop()

        let link = info.args[0]
        let title
        let source

        request(link, function (error, response, body)
        {
            const dom = new JSDOM(response.body)
            title = dom.window.document.getElementsByTagName('h1').item(0).textContent
        })

        var sources = await jwPlayerScraper.getMediaSources(link)

        try { source = sources[sources.length - 1].file } catch (err) { message.reply(err.toString()); return }

        let streamInfo =
        {
            title: title,
            source: source
        }

        index.server.start(6969, streamInfo)

        message.reply('Stream started at http://quicksense.ddns.net:6969')
    }
}
