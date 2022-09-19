const sandwiches = require('../sandwiches.json')

module.exports = {
	name: 'clearpanini',
	description: 'clears the panini list',
	category: 'Admin',
	execute: async (message, info, isAutomated = false) => {
		if (!isAutomated) {
			if (await isAdmin(message)) {
				sandwiches.orders = []

				message.reply('Panini list has been cleared')
			} else
				message.reply('Only administrators are allowed to use this command!')
		} else sandwiches.orders = []
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
