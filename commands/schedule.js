const moment = require('moment')
const schedule = require('../storage/schedule.json')
module.exports = {
	name: 'schedule',
	description: 'display the school schedule for that day',
	category: 'Utility',
	execute: async (message, info, isAutomatic = false) => {
		if (info.args.length == 0) {
			message.reply(
				'Please specify a class (i/t)\n*Syntax*: wp schedule <class> <day> (optional) <time> (optional)'
			)
			return
		}

		let result = new String()
		let currentDate = new Date()
		let timestamp = `${
			currentDate.getHours().toString().length < 2
				? '0' + currentDate.getHours().toString()
				: currentDate.getHours().toString()
		}:${
			currentDate.getMinutes().toString().length < 2
				? '0' + currentDate.getMinutes().toString()
				: currentDate.getMinutes().toString()
		}`
		let ranges = []
		let timeLeft = new moment()

		let classType = info.args[0]

		let day =
			info.args[1] == null
				? currentDate
						.toLocaleDateString('en-US', { weekday: 'long' })
						.toLowerCase()
				: info.args[1]
		let timeNow = moment(info.args[2], 'HH:mm').isValid()
			? moment(info.args[2], 'HH:mm')
			: moment(timestamp, 'HH:mm')

		if (day == 'saturday' || day == 'sunday') {
			message.reply(`The school is closed on ${day}`)
			return
		}

		for (let i = 0; i < schedule.it.length; i++) {
			ranges.push({
				start: moment(schedule.it[i].range.substring(0, 5), 'HH:mm'),
				end: moment(schedule.it[i].range.substring(8, 13), 'HH:mm'),
			})
		}

		if (
			classType == 'i' ||
			classType == 'info' ||
			classType == 'informatica' ||
			classType == 'it'
		)
			classType = 'it'
		else if (
			classType == 't' ||
			classType == 'tele' ||
			classType == 'telecom' ||
			classType == 'telecomunicazioni'
		)
			classType = 'telecom'

		result += `*${day}*\n\n`.toUpperCase()

		for (
			let i = 0;
			i < schedule.it.length;
			i++ // previous, current, next subject and time left till end of class
		) {
			if (timeNow.isBetween(ranges[i].start, ranges[i].end)) {
				timeLeft = moment(ranges[i].end).diff(timeNow, 'minutes')

				if (i == 0)
					result += `Previous: /\nCurrent: ${
						schedule[classType][i].subjects[day]
					}\nNext: ${schedule[classType][i + 1].subjects[day]}`
				else if (i > 0 && i < schedule.it.length)
					result += `Previous: ${
						schedule[classType][i - 1].subjects[day]
					}\nCurrent: ${schedule[classType][i].subjects[day]}\nNext: ${
						schedule[classType][i + 1].subjects[day]
					}`
				else
					result += `Previous: ${
						schedule[classType][i - 1].subjects[day]
					}\nCurrent: ${schedule[classType][i].subjects[day]}\nNext: /`

				result += `\n\n*Time till next class*: ${timeLeft} minutes\n`
			}
		}

		result += `\n*Schedule:*\n`

		for (
			let i = 0;
			i < schedule.it.length;
			i++ // list all subjects in that day
		) {
			if (schedule[classType][i].subjects[day] != null)
				result += `[${i + 1}°] (${schedule[classType][i].range}) ${
					schedule[classType][i].subjects[day]
				}\n`
			if (i == 2 || i == 4) result += `----- INTERVALLO -----\n`
		}

		result = result.replaceAll('undefined', '/')

		if (isAutomatic) return result
		else message.reply(result)
	},
}
