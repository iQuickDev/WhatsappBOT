module.exports = {
	name: 'allowpermissions',
	description: 'allow group info modifications to everyone',
	category: 'Admin',
	execute: async (message, info) => {
		if (await isAdmin(message)) {
			let chat = await message.getChat()

			if (chat.isGroup) {
				chat.setInfoAdminsOnly(false)
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
