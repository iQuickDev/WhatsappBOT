const express = require('express')
module.exports = class ServerManager {
	app = express()
	isRunning = false
	port
	streamInfo

	constructor() {
		this.app.use(express.static('./stream'))
		this.app.use(express.json())
		this.app.get('/', (req, res) => console.log(req.body))
		this.app.get('/info', (req, res) => res.send(this.streamInfo))
		console.log('ServerManager was loaded')
	}

	start(port, streamInfo) {
		this.port = port
		this.streamInfo = streamInfo

		if (!this.isRunning) {
			this.app.listen(this.port, () =>
				console.log(`HTTP server started on port ${port}`)
			)
			this.isRunning = true
		}
	}

	updateStream(streamInfo) {
		this.streamInfo = streamInfo
	}
}
