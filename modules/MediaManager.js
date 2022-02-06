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
        this.commands = []
    }
}