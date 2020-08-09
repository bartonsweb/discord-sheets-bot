const { CommandoClient } = require('discord.js-commando');
const GoogleSheet = require('./GoogleSheet');

class GSheetCommandoClient extends CommandoClient {
    constructor(options) {
        super(options);

        this.logger = require('simple-node-logger').createSimpleLogger('bot.log');
        this.spreadsheet = new GoogleSheet(this);
    }

}

module.exports = GSheetCommandoClient;