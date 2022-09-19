let title = document.querySelector('#animetitle')
let episode = document.querySelector('#animeepisode')
let duration = document.querySelector('#animeduration')
let viewers = document.querySelector('#animeviewers')
let video = document.querySelector('#animecontent')

let address = 'http://iquickdev.ddns.net' //"https://iquickdev.ddns.net"
let previousSource
let port = 6969

async function fetchInfo() {
	await fetch(`${address}:${port}/info`)
		.then((response) => response.json())
		.then((data) => {
			title.textContent = `${data.title}`
			if (previousSource == data.source) return
			else video.setAttribute('src', data.source)

			previousSource = data.source
		})
}

fetchInfo()

setInterval(fetchInfo, 30000)
