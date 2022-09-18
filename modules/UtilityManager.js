const request = require('request')
const google = require('googlethis');
const schedule = require('../schedule.json')
const index = require('../index.js')
const sandwiches = require('../sandwiches.json');
const { MessageMedia } = require('whatsapp-web.js');


module.exports = class UtilityManager {
    client
    moduleName
    moduleDescription
    commands

    constructor() {
        this.client = index.client
        this.moduleName = "Utility"
        this.moduleDescription = "Useful commands"
        this.commands = [this.image, this.decimaltobinary, this.binarytodecimal, this.decimaltohex, this.hextodecimal, this.asciitodecimal, this.decimaltoascii, this.getrequest, this.covid, this.schedule, this.panini, this.panino]
        console.log("UtilityManager loaded!")
    }
    
    async getrequest(message, info) {
        await request(info.args[0], function (error, response, body) { message.reply(body) })
    }
}
