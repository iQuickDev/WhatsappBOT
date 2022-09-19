const request = require('request')

module.exports = {
	name: 'getrequest',
	description: 'send a GET request to a website',
	category: 'Utility',
	execute: (message, info) => {
		request(info.args[0], (error, response, body) => {
			message.reply(body)
		})
	},
}
