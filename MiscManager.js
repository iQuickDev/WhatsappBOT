const index = require('./index.js')
const igScraper = require('scraper-instagram')
const myAnimeList = require('mal-scraper')
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
        this.commands = [this.help, this.uptime, this.igprofile, this.anime]
        console.log("MiscManager loaded!")
        console.log(this.scraperClient)
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
        console.log(index.cock)
    }

    async igprofile(message, info)
    {
        await scraperClient.getProfile(info.args[0]).then(profile =>
        {
            message.reply(`*Username*: ${info.args[0]}\n*Full Name*: ${profile.name}\n*Posts*: ${profile.posts}\n*Followers/Following*: ${profile.followers}/${profile.following}\n*Biography*: ${profile.bio}\n*Website*: ${profile.website}\n*Profile picture*: ${profile.pic}\n*Profile link*: ${profile.link}`)
        }).catch(err => message.reply(err.toString()))
    }

    async anime(message, info)
    {
        await myAnimeList.getInfoFromName(info.args[0]).then(info =>
        {
            message.reply(`*Title ENG/JAP*: ${info.englishTitle}/${info.japaneseTitle}\n*Description*: ${info.synopsis}\n*Episodes*: ${info.episodes}\n*Aired*: ${info.aired}\n*Score*: ${info.score}\n*Link*: ${info.url}`)
        }).catch(err => message.reply(err.toString()))
    }
}