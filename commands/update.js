const config = require('../config.json')
const { exec } = require('child_process')

module.exports = {
	name: 'update',
	description: 'update the bot to the latest version',
	category: 'Reserved',
	execute: async (message, info) => {
		if (isDev(message)) {
			let newVersion = await (
				await fetch(
					'https://raw.githubusercontent.com/iQuickDev/WhatsappBOT/master/config.json'
				)
			).json()
			if (newVersion.version != config.version) {
				message.reply(
					`Update started\ncurrent version: ${config.version}\nnew version: ${newVersion.version}`
				)
				exec(
					'git stash && git stash drop && git pull && npm install && pm2 restart WhatsappBOT',
					(error, stdout, stderr) => {
						if (error) {
							message.reply(error)
							return
						}
						if (stderr) {
							message.reply(stderr)
							return
						}
						message.reply(stdout)
					}
				)
			} else message.reply('No update found!')
		} else message.reply('Only developers are allowed to use this command!')
	},
}

function isDev(message) {
	return message.fromMe
}
