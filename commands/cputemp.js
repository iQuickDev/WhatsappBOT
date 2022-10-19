const { exec } = require('child_process')

module.exports = {
	name: 'cputemp',
	description: 'display the temperature of the cpu',
	category: 'Utility',
	execute: (message, info) => {
		exec(
			'cat /sys/class/thermal/thermal_zone0/temp',
			(error, stdout, stderr) => {
				if (!isNaN(parseInt(stdout)))
					message.reply(`CPU Temp: ${(parseInt(stdout) / 1000).toFixed(1)} °C`)
				else message.reply(`Can't retrieve the CPU temperature on device`)
			}
		)
	},
}
