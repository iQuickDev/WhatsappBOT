const request = require('request').defaults({ encoding: null })
const booru = require('booru')
const { MessageMedia } = require('whatsapp-web.js')

module.exports = {
	name: 'r34',
	description: 'fetch a r34 image',
	category: 'NSFW',
	execute: (message, info) => {
		booru
			.search('rule34', [`${info.args[0]}`], { limit: 1, random: true })
			.then((posts) => {
				if (posts[0] == undefined) {
					message.reply('No results found')
					return
				} else {
					request.get(posts[0].fileUrl, function (error, response, body) {
						if (!error && response.statusCode == 200) {
							let data = Buffer.from(body).toString('base64')
							const media = new MessageMedia('image/png', data)
							message.reply(media)
						}
					})
				}
			})
	},
}
