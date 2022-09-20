const config = require('../config.json')

module.exports = {
	name: 'version',
	description: 'display the current version of the bot',
	category: 'Reserved',
	execute: (message, info) => {
		message.reply(
			`WhatsappBOT ${config.version}${
				process.arch != 'arm' ? '-dev' : '-stable'
			}`
		)
	},
}
