const { MessageMedia } = require('whatsapp-web.js')
const index = require('../index.js')

module.exports = class MediaManager
{
    client
    moduleName
    moduleDescription
    commands

    constructor()
    {
        this.client = index.client
        this.moduleName = "Media"
        this.moduleDescription = "Video/Audio related commands"
        this.commands = [this.audio]
        console.log("MediaManager loaded!")
    }

    async audio(message, info)
    {
        let selectedAudio

        switch(info.args[0])
        {
            case "ecceccion":
                selectedAudio = MessageMedia.fromFilePath('./media/audio/ecceccion.mp3')
                break
        }

        await message.getChat().then(chat => chat.sendMessage(selectedAudio, {sendAudioAsVoice: true})).catch(error => message.reply(error))
    }
}