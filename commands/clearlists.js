const index = require('../index.js')

module.exports = {
	name: 'clearlists',
	description: 'clears all lists',
	category: 'Admin',
	execute: async (message, info) => {
		if (await isAdmin(message)) {
			index.list.reset()
		} else message.reply('Only administrators are allowed to use this command!')
	},
}

async function isAdmin(message) {
	let chat = await message.getChat()
	let admin = false
	if (chat.isGroup) {
		for (let participant of chat.participants) {
			if (participant.isAdmin && participant.id._serialized === message.from) {
				admin = true
			}
		}
	}
	return admin
}
