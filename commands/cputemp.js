import { exec } from 'child_process'

export const name = 'cputemp'
export const description = 'display the temperature of the cpu'
export const category = 'Utility'
export function execute(message, info) {
	exec('cat /sys/class/thermal/thermal_zone0/temp', (error, stdout, stderr) => {
		if (!isNaN(parseInt(stdout)))
			message.reply(`CPU Temp: ${(parseInt(stdout) / 1000).toFixed(1)} °C`)
		else message.reply(`Can't retrieve the CPU temperature on device`)
	})
}
