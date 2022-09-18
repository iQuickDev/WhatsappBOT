const igScraper = require('scraper-instagram')
const scraperClient = new igScraper()

module.exports = {
    name: 'igprofile',
    description: 'fetch an instagram profile',
    category: 'Miscellanous',
    execute: async (message, info) => {
        await scraperClient.getProfile(info.args[0]).then(profile => {
            message.reply(`*Username*: ${info.args[0]}\n*Full Name*: ${profile.name}\n*Posts*: ${profile.posts}\n*Followers/Following*: ${profile.followers}/${profile.following}\n*Biography*: ${profile.bio}\n*Website*: ${profile.website}\n*Profile picture*: ${profile.pic}\n*Profile link*: ${profile.link}`)
        }).catch(err => message.reply(err.toString()))
    }
}