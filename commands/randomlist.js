const index = require('../index.js')

module.exports = {
	name: 'randomlist',
	description:
		'generate a random ordered list of the participants of the group',
	category: 'Utility',
	execute: async (message, info) => {
		let chat = await message.getChat()
		let mentions = []
		let users = []

		if (chat.isGroup) {
			let participants = chat.participants
			let mentionString = '*SHUFFLED LIST*\n'

			for (const participant of participants) {
				let contact = await index.client.getContactById(
					participant.id._serialized
				)
				mentions.push(contact)
				users.push(participant.id.user)
			}

			shuffle(users)

			for (let i = 0; i < users.length; i++) {
				mentionString += `${i + 1}. @${users[i]}\n`
			}

			chat.sendMessage(mentionString, { mentions })
		} else message.reply('This command can only be used in a group')
	},
}

function shuffle(array) {
	for (let i = array.length - 1; i > 0; i--) {
		const j = Math.floor(Math.random() * (i + 1))
		;[array[i], array[j]] = [array[j], array[i]]
	}
}
