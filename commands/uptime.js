module.exports = {
    name: 'uptime',
    description: 'displays for how long the bot has been running',
    category: 'Miscellaneous',
    execute: (message, info) => {
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
}