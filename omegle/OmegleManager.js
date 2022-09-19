const Omegle = require('omegle-node-fix')
const { Server } = require('socket.io')

module.exports = class OmegleManager {
	omegleClient
	io

	constructor() {
		this.io = new Server(10831)
		this.omegleClient = new Omegle()

		this.omegleClient.on('gotMessage', (msg) => {
			this.io.emit('receivedMessage', msg)
		})

		this.io.on('sendMessage', (msg) => {
			this.omegleClient.send(msg)
		})

		this.omegleClient.on('disconnect', () => {
			this.io.emit('disconnected')
		})

		console.log('OmegleManager loaded!')
	}

	getConnection() {
		return this.omegleClient.connected
	}

	connect() {
		this.omegleClient.connect()
	}

	disconnect() {
		this.omegleClient.disconnect()
	}
}
