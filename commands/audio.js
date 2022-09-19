const { MessageMedia } = require('whatsapp-web.js')
const fs = require('fs')

module.exports = {
	name: 'audio',
	description: 'play audio',
	category: 'Utility',
	execute: async (message, info) => {
		if (!info.args[0]) {
			let files = []
			fs.readdirSync('./media/audio').forEach((f) => files.push(f))
			message.reply(`*Available audio files:* ` + files.toString())
		}

		let selectedAudio

		switch (info.args[0]) {
			case 'ecceccion':
				selectedAudio = MessageMedia.fromFilePath('./media/audio/ecceccion.mp3')
				break
		}

		await message
			.getChat()
			.then((chat) =>
				chat.sendMessage(selectedAudio, { sendAudioAsVoice: true })
			)
			.catch((error) => message.reply(error))
	},
}
