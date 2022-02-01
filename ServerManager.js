const express = require('express')
const { createHttpTerminator } = require('http-terminator')

module.exports = class ServerManager
{
    app = express()
    isRunning = false
    port
    streamInfo

    constructor()
    {
        this.app.use(express.static('./stream'))
        this.app.use(express.json())
        this.app.get('/', (req, res) => res.sendFile('./stream/index.html'))
        this.app.get('/info', (req, res) => res.send(this.streamInfo))
        console.log("ServerManager loaded!")
    }

    start(port, streamInfo)
    {
        this.port = port
        this.streamInfo = streamInfo

        if (!this.isRunning)
        {
            this.app.listen(this.port, () => console.log(`ServerManager is listening on port ${port}`))
            this.isRunning = true
        }
    }

    updateStream(streamInfo)
    {
        this.streamInfo = streamInfo
    }
}
