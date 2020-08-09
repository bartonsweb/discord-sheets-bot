require('dotenv').config();
const { prefix, owner } = require('./config.json');
const path = require('path');
const GSheetCommandoClient = require('./utils/GSheetCommandoClient');

const client = new GSheetCommandoClient({
    commandPrefix: prefix,
    owner: owner,
    disableEveryone: true
});


client.registry
	.registerDefaultTypes()
	.registerGroups([
		['spreadsheet', 'Spreadsheet Commands']
	])
	.registerDefaultGroups()
	.registerDefaultCommands({
        ping: false,
        prefix: false,
        unknownCommand: false
    })
	.registerCommandsIn(path.join(__dirname, 'commands'));

client.on('ready', async () => {
    console.log('Logged in!');
    await client.user.setActivity(`Reading sheet !help`);
});

client.on('error', async (err) => {
    client.logger.error(err);
    console.error(err)
});

client.on('message', async (message) => {

    if (message.author.id === client.user.id) {
        return;
    }

    if (message.channel.type === 'group') {
        return;
    }

    if (message.author.bot) {
        return;
    }

    if(!message.guild){
        return
    }

});

client.login(process.env.TOKEN).catch((err) => {
    client.logger.error(err);
});