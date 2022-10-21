const fs = require('fs')
const path = require('path')
const index = require('../index')

const filePath = path.resolve(__dirname, '../storage/poll.json')

module.exports = {
	name: 'poll',
	description: 'create a poll',
	category: 'Admin',
	execute: async (message, info) => {
		// make a new poll whether there isn't any, otherwise return the already existing poll
		function getPollJson(name, options) {
			if (!fs.existsSync(filePath)) {
				if (options.length <= 1) {
					message.reply(
						'You need to provide at least 2 options in order to start a poll'
					)
					return null
				}
				const newPoll = {
					name,
					_totalVote: 0,
					_votersId: [],
				}
				const optionsArray = []

				for (let option of options) {
					optionsArray.push({
						name: option,
						votes: 0,
					})
				}
				newPoll.options = optionsArray
				return newPoll
			} else {
				return JSON.parse(fs.readFileSync(filePath, 'utf-8'))
			}
		}

		// write the poll to the file
		function savePoll(poll) {
			fs.writeFileSync(filePath, JSON.stringify(poll))
		}

		// vote controller
		async function voteControl(message, voteNumber) {
			const poll = getPollJson()

			// check whether the user has already voted
			const currentVoterId = message.id.participant
			if (poll._votersId.find((voterId) => voterId === currentVoterId)) {
				message.reply('You have already voted!')
			} else {
				if (voteNumber < 1 || voteNumber > poll.options.length) {
					message.reply('Invalid vote number')
				} else {
					poll._totalVote++
					poll.options[voteNumber - 1].votes++
					poll._votersId.push(currentVoterId)
					savePoll(poll)
				}
			}
		}

		// send the poll to the chat
		function showPoll() {
			const poll = getPollJson()
			let s = poll.name + '\n'
			for (let i = 0; i < poll.options.length; i++) {
				s += `${i + 1}. ${poll.options[i].name}: ${poll.options[i].votes}`

				if (poll._totalVote !== 0) {
					s += ` (${((poll.options[i].votes / poll._totalVote) * 100).toFixed(
						2
					)}%)`
				}

				s += '\n'
			}
			message.reply(s)
		}

		switch (info.args[0]) {
			case 'start': {
				if (await isAdmin(message)) {
					const poll = getPollJson(info.args[1], info.args.splice(2))

					// if poll is null, it means that the user didn't provide enough options
					if (!poll) break
					savePoll(poll)
					showPoll()
				}
				break
			}
			case 'vote': {
				const voteNumber = Number(info.args[1])
				// validate number
				if (!Number.isNaN(voteNumber)) {
					await voteControl(message, voteNumber)
				} else {
					message.reply('Invalid vote number')
				}
				showPoll()

				break
			}
			case 'show': {
				showPoll()
				break
			}
			case 'end': {
				if (await isAdmin(message)) {
					if (fs.existsSync(filePath)) {
						showPoll()
						fs.unlinkSync(filePath)
					} else {
						message.reply('There is no poll')
					}
				}
				break
			}
			case 'help': {
				message.reply(
					'*Usage*: \n\n' +
						'- poll *start* <poll name> <option 1> <option 2> ... <option n>, admin only\n\n' +
						'- poll *vote* <vote number> \n\n' +
						'- poll *show* \n\n' +
						'- poll *end*, admin only'
				)
				break
			}
			default: {
				message.reply('Invalid command')
				break
			}
		}
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
