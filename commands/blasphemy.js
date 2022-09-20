const blasphemyPhrases = require('../blasphemy.json')

module.exports = {
	name: 'blasphemy',
	description: 'get a random blasphemous quote',
	category: 'NSFW',
	execute: (message, info) => {
		if (Randomizer(25) == 20) {
			message.reply(
				blasphemyPhrases.specials[
					Randomizer(blasphemyPhrases.specials.length - 1)
				]
			)
			return
		}
		if (Randomizer(2))
			message.reply(
				`${
					blasphemyPhrases.males[Randomizer(blasphemyPhrases.males.length - 1)]
				} ${
					blasphemyPhrases.male_words[
						Randomizer(blasphemyPhrases.male_words.length - 1)
					]
				}`
			)
		else
			message.reply(
				`${
					blasphemyPhrases.females[
						Randomizer(blasphemyPhrases.males.length - 1)
					]
				} ${
					blasphemyPhrases.female_words[
						Randomizer(blasphemyPhrases.female_words.length - 1)
					]
				}`
			)
	},
}

function Randomizer(max) {
	return Math.floor(Math.random() * max)
}
