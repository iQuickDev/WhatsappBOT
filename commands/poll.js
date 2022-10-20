const fs = require('fs')
const path = require("path");

const filePath = path.resolve(__dirname, "../storage/poll.json");

module.exports = {
	name: 'poll',
	description: 'create a poll',
	category: 'Admin',
	execute: async (message, info) => {
		// make a new poll whether there isn't any, otherwise return the already existing poll
		function getPollJson(name, options) {
			if (!fs.existsSync(filePath)) {
				const newPoll = {
					name,
					_totalVote: 0,
				};
				const optionsArray = [];
				for (let option of options) {
					optionsArray.push({
						name: option,
						votes: 0,
					});
				}
				newPoll.options = optionsArray;
				return newPoll;
			} else {
				return JSON.parse(fs.readFileSync(filePath, "utf-8"));
			}
		}

		// write the poll to the file
		function savePoll(poll) {
			// save poll to storage
			fs.writeFileSync(filePath, JSON.stringify(poll));
		}

		// vote controller
		function voteControl(voteNumber) {
			const poll = getPollJson();
			if (voteNumber < 1 || voteNumber > poll.options.length) {
				message.reply("Invalid vote number");
			} else {
				poll._totalVote++;
				poll.options[voteNumber - 1].votes++;
				savePoll(poll);
			}
		}

		// send the poll to the chat
		function showPoll() {
			const poll = getPollJson();
			let s = poll.name + "\n";
			for (let i = 0; i < poll.options.length; i++) {
				s += `${i + 1}. ${poll.options[i].name}: ${poll.options[i].votes}`;

				if (poll._totalVote !== 0) {
					s += ` (${((poll.options[i].votes / poll._totalVote) * 100).toFixed(
						2
					)}%)`;
				}

				s += "\n";
			}
			message.reply(s);
		}


		if (await isAdmin(message)) {
			switch (info.args[0]) {
				case "start": {
					const poll = getPollJson(info.args[1], info.args.splice(2));
					savePoll(poll);
					showPoll();
					break;
				}
				case "vote": {
					const voteNumber = Number(info.args[1]);
					// validate number
					if (!Number.isNaN(voteNumber)) {
						voteControl(voteNumber);
					} else {
						message.reply("Invalid vote number");
					}
					showPoll();

					break;
				}
				case "show": {
					showPoll();
					break;
				}
				case "end": {
					if (fs.existsSync(filePath)) {
						showPoll();
						fs.unlinkSync(filePath);
					}
					break;
				}
				default: {
					message.reply("Invalid command");
					break;
				}
			}
		}
	}

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


