module.exports = {
	name: 'renamegroup',
	description: 'rename the group',
	category: 'Admin',
	execute: async (message, info) => {
		if (await isAdmin(message)) {
			let chat = await message.getChat()

			if (chat.isGroup) {
				chat.setDescription(info.args[0])
				message.reply(`Description has been set to *${info.args[0]}*`)
			} else message.reply('This command can only be used in a group')
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
