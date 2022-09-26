const index = require('../index')

module.exports = {
	name: 'omegle',
	description: 'start a text session on omegle',
	category: 'Miscellaneous',
	execute: async (message, info) => {
		if (!info.args[0]) {
			message.reply('*Syntax*: wp omegle <action> (connect / disconnect) ')
		}
		if (info.args[0] == 'c' || info.args[0] == 'connect') {
			let chat = await message.getChat()
			if (!index.omegle.isReady) {
				index.omegle.setup(chat)
			} else if (index.omegle.isReady && index.omegle.chat != chat) {
				index.omegle.chat = chat
				index.omegle.connect()
			} else index.omegle.connect()
		} else if (info.args[0] == 'd' || info.args[0] == 'disconnect') {
			index.omegle.disconnect()
		}
	},
}
