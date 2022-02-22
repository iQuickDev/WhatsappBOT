const index = require('../index.js')
const config = require('../config.json')
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

    constructor()
    {
        this.client = index.client
        this.moduleName = "Misc"
        this.moduleDescription = "Miscellaneous commands"
        this.commands = [this.help, this.uptime, this.igprofile, this.animeinfo, this.streamanime, this.fakeidentity, this.version]
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

        helpString += `\n*Syntax*: wp <command> <arguments> (optional)\n`
        helpString += `\nWhatsappBOT ${config.version}${process.arch != 'arm' ? '-dev' : '-stable'}`

        message.reply(helpString)
    }

    uptime(message, info)
    {
        let uptime = process.uptime()
        let uptimeString = ""
        let days = Math.floor(uptime / 86400)
        uptime -= days * 86400
        let hours = Math.floor(uptime / 3600)
        uptime -= hours * 3600
        let minutes = Math.floor(uptime / 60)
        uptime -= minutes * 60
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
            message.reply('Please provide a link from https://gogoplay1.com or https://animelove.tv')
            return
        }

        let link = info.args[0]

        let streamInfo =
        {
            title: null,
            source: null
        }

        if (link.includes('gogoplay1.com'))
        {
            request(link, (error, response, body) =>
            {
                const dom = new JSDOM(response.body)
                streamInfo.title = dom.window.document.getElementsByTagName('h1').item(0).textContent
            })
    
            var sources = await jwPlayerScraper.getMediaSources(link)
    
            try { streamInfo.source = sources[sources.length - 1].file } catch (err) { message.reply(err.toString()); return }
        }
        else if (link.includes('animelove.tv'))
        {
            request(link, async (error, response, body) =>
            {
                const dom = new JSDOM(await response.body)
                streamInfo.title = dom.window.document.getElementsByTagName('h1').item(0).textContent
                streamInfo.source = dom.window.document.querySelector('source').getAttribute('src')
            })
        }

        if (index.server.isRunning)
        index.server.updateStream(streamInfo)
        else
        index.server.start(6969, streamInfo)

        message.reply('Stream started at http://quicksense.ddns.net:6969')
    }

    version(message, info)
    {
        message.reply(`WhatsappBOT ${config.version}${process.arch != 'arm' ? '-dev' : '-stable'}`)
    }
}
