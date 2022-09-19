const pornhub = require('@justalk/pornhub-api')

module.exports = {
	name: 'pornhub',
	description: 'fetch a pornhub video',
	category: 'NSFW',
	execute: async (message, info) => {
		let videos = await pornhub.search(info.args[0])
		let randomVideo = videos.results[Randomizer(videos.results.length)]
		message.reply(
			`*Title*: ${randomVideo.title}\n*Author:* ${
				randomVideo.author
			}\n*Views*: ${Math.round(randomVideo.views)}\n*URL*: ${randomVideo.link}`
		)
	},
}

function Randomizer(max) {
	return Math.floor(Math.random() * max)
}
