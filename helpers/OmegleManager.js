const omegle = require('omegle-node-fix')
const index = require('../index.js')

module.exports = class OmegleManager {
	socket
	chat
	listener
	isReady = false

	constructor() {
		console.log('OmegleManager was loaded')
	}

	setup(chat) {
		this.socket = new omegle()
		this.chat = chat
		this.listener = async (msg) => {
			if (
				!msg.body.startsWith('*[OMEGLE]*') &&
				this.chat.id._serialized == (await msg.getChat()).id._serialized &&
				this.socket.connected
			)
				this.socket.send(msg.body)
		}
		index.client.addListener('message_create', this.listener)
		this.socket.language = 'it'
		this.socket.on('gotMessage', (msg) => {
			this.chat.sendMessage(`*[OMEGLE]*: ${msg}`)
		})
		this.socket.on('connected', () => {
			console.log('connected')
			this.chat.sendMessage(`*[OMEGLE]*: _connected_`)
		})

		this.socket.on('disconnected', () => {
			console.log('disconnected')
			this.chat.sendMessage(`*[OMEGLE]*: _disconnected_`)
		})
		this.isReady = true
		this.connect()
	}

	connect() {
		this.socket.connect()
	}

	disconnect() {
		this.socket.disconnect()
	}
}
