const index = require('../index')
const config = require('../config.json')
module.exports = {
	name: 'help',
	description: 'display a help message',
	category: 'Utility',
	execute: (message, info) => {
		let helpString = ''
		if (info.args[0]) {
			let cmd = index.commands.find((cmd) => cmd.name == info.args[0])
			helpString += `*Command:* ${cmd.name}\n${cmd.description}\n*Category:* ${cmd.category}`
		} else {
			helpString = '*Commands:*\n'
			for (const cmd of index.commands) {
				helpString += cmd.name + ' '
			}
		}

		helpString += `\n*Syntax*: wp <command> <arguments> (optional)\n`
		helpString += `\nWhatsappBOT ${config.version}${
			process.arch != 'arm' ? '-dev' : '-stable'
		}`

		message.reply(helpString)
	},
}
