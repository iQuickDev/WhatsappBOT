const fakeId = require('fake-identity')

module.exports = {
	name: 'fakeidentity',
	description: 'generate a fake identity',
	category: 'Miscellaneous',
	execute: (message, info) => {
		let id = fakeId.generate()
		message.reply(
			`*First name*: ${id.firstName}\n*Last name*: ${id.lastName}\n*Email*: ${id.emailAddress}\n*Phone*: ${id.phoneNumber}\n*Street*: ${id.street}\n*City*: ${id.city}\n*Zip*: ${id.zipCode}\n*Date of birth*: ${id.dateOfBirth}\n*Gender*: ${id.sex}\n*Company*: ${id.company}\n*Department*: ${id.department}`
		)
	},
}
