module.exports = {
	name: 'unmutegroup',
	description: 'allow everyone to send messages',
	category: 'Admin',
	execute: async (message, info) => {
		if (await isAdmin(message)) {
			let chat = await message.getChat()

			if (chat.isGroup) {
				chat.setMessagesAdminsOnly(false)
			}
		} else message.reply(`Only administrators are allowed to use this command!`)
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
