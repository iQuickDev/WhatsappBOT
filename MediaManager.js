module.exports = class MediaManager
{
    client
    moduleName
    moduleDescription
    commands

    constructor(client)
    {
        this.client = client
        this.moduleName = "Media"
        this.moduleDescription = "Video/Audio related commands"
        this.commands = []
    }

    
}