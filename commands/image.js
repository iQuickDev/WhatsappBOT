const { MessageMedia } = require('whatsapp-web.js')
const request = require('request').defaults({ encoding: null })

module.exports = {
	name: 'image',
	description: 'fetch an image from google images',
	category: 'Utility',
	execute: (message, info) => {
		google
			.image(info.args[0], { safe: false, hl: 'it' })
			.then((res) => {
				request.get(res[0].url, function (error, response, body) {
					if (!error && response.statusCode == 200) {
						let data = Buffer.from(body).toString('base64')
						message.reply(new MessageMedia('image/jpeg', data))
					}
				})
			})
			.catch(() => message.reply('*REJECTED*: No results found'))
	},
}
