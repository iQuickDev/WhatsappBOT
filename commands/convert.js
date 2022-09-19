module.exports = {
	name: 'convert',
	description: 'convert a value from a base to another',
	category: 'Utility',
	execute: (message, info) => {
		let args = info.args.toString().split(' ')
		message.reply(parseInt(args[0]).toString(args[1]))
	},
}
