module.exports = {
	name: 'purge',
	description: 'purge the chat',
	category: 'Admin',
	execute: async (message, info) => {
		if (await isAdmin(message)) {
			let purgeString = new String('\n')

			for (let i = 0; i < 6; i++) {
				purgeString += purgeString
			}

			message.reply(purgeString)
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
