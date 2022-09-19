const index = require('../index')

module.exports = {
	name: 'massmention',
	description: 'mentions all users in the group',
	category: 'Admin',
	execute: async (message, info) => {
		if (await isAdmin(message)) {
			let chat = await message.getChat()
			let mentions = []

			if (chat.isGroup) {
				let participants = chat.participants
				let mentionString = '*MASS MENTION REQUESTED*\n'

				for (const participant of participants) {
					let contact = await index.client.getContactById(
						participant.id._serialized
					)
					mentions.push(contact)
					mentionString += `@${participant.id.user} `
				}

				chat.sendMessage(mentionString, { mentions })
			}
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
