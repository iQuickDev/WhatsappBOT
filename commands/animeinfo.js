module.exports = {
    name: 'animeinfo',
    description: 'fetch info about anime',
    category: '',
    execute: async (message, info) => {
        await myAnimeList.getInfoFromName(info.args[0]).then(info => {
            message.reply(`*Title ENG/JAP*: ${info.englishTitle}/${info.japaneseTitle}\n*Description*: ${info.synopsis}\n*Episodes*: ${info.episodes}\n*Aired*: ${info.aired}\n*Score*: ${info.score}\n*Link*: ${info.url}`)
        }).catch(err => message.reply(err.toString()))
    }
}