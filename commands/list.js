const index = require('../index.js')

module.exports = {
	name: 'list',
	description:
		'generate an ordered list of the participants of the group using a balanced algorithm based on previous lists',
	category: 'Utility',
	execute: async (message, info) => {
		console.log(info)
		if (info.args.length == 0) {
			let lists = '*Available Lists*: '
			for (const list of index.list.pool) lists += list.name + ' '
			message.reply(
				'*Syntax*:\n wp list generate <name> <user1>,<user2>,<user3>\n wp list swap <name> <user1>,<user2>\n wp list <name>\n'.concat(
					index.list.pool.length > 0 ? lists : ''
				)
			)
			return
		}
		
		switch (info.args[0]) {
			case 'generate': {
				let participants = info.args.toString().replaceAll(',',' ').substring(
					info.args[0].length + info.args[1].length + 2,
					info.args.toString().length
				).replace(/  +/gm, ',').split(',').map(o => o.trim())
				let generatedList = index.list.generate(info.args[1], participants)
				let msg = `*${info.args[1]}*\n`
				for (let i = 0; i < generatedList.objects.length; i++)
					msg += `${i + 1}. ${generatedList.objects[i].trim()}\n`
				message.reply(msg)
				break
			}
			case 'swap': {
				if (await isAdmin(message)) {
					// todo (admin only)
					message.reply('Feature not yet developed')
				} else
					message.reply(`Only administrators are allowed to use this command!`)
				break
			}
			default: {
				let foundList = index.list.pool.find((l) => l.name.toLowerCase() == info.args[0].toLowerCase())
				if (!foundList) {
					message.reply('*REJECTED*: List not found')
					return
				}

				let msg = `*${info.args[0]}*\n`
				for (let i = 0; i < foundList.objects.length; i++)
					msg += `${i + 1}. ${foundList.objects[i]}\n`
				message.reply(msg)
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
