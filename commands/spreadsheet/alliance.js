const { Command } = require('discord.js-commando');

function listPlayers(message, players, alliance) {
	const data = [];

	data.push(`**${alliance}**`);
	data.push(`*${players.join(', ')}*`);
	data.push(
	`\nYou can grab an individual players data using \`${message.client.options.commandPrefix}player [name]\`.`,
	);

	return data;
}


module.exports = class allianceCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'alliance',
			group: 'spreadsheet',
			memberName: 'alliance',
			description: 'List all of the members of an alliance that we have data for.',
			guildOnly: true,
			throttling: {
                usages: 2,
                duration: 120
            },
			args: [
				{
					key: 'alliance',
					prompt: 'Which alliance would you like to lookup?',
					type: 'string',
				},
			],
		});
		this.roles = ['Member', 'BotAccess'];
	}

	hasPermission(message) {
		if(this.roles && !message.member.roles.cache.some( r => this.roles.includes(r.name)) ) return 'You don\'t have the required role for this command.';
		return true
	}

	run(message, { alliance }) {
		
	    message.channel.send('Fetching, please wait...').then((m) => {
	      message.client.spreadsheet.getAlliancePlayerData(alliance).then((data) => {
	        m.delete();
	        data.players && data.players.length !== 0 ? message.channel.send(listPlayers(message, data.players, data.alliance), { split: true }) : message.channel.send("Oops. No alliance by that name found. \nIf you're sure it's right, please contact Erielia");
	      });
	    });

	}
};