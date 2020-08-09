const { Command } = require('discord.js-commando');

function listAlliances(message, alliances) {
  const data = [];

  const text = data.push(alliances.join(', '));

  data.push(
    `\nYou can grab a list of alliance members using \`${message.client.options.commandPrefix}alliance [name]\`.`,
  );

  return data;
}


module.exports = class alliancesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'alliances',
			group: 'spreadsheet',
			memberName: 'alliances',
			description: 'List all alliances we have any data for.',
			guildOnly: true,
			throttling: {
                usages: 1,
                duration: 1800
            }
		});
		this.roles = ['Member', 'BotAccess'];
	}

	hasPermission(message) {
		if(this.roles && !message.member.roles.cache.some( r => this.roles.includes(r.name)) ) return 'You don\'t have the required role for this command.';
		return true
	}

	run(message, { player }) {
		
	    message.channel.send('Fetching, please wait...').then((m) => {
	      message.client.spreadsheet.getAlliancesList().then((alliances) => {
	        m.delete();
	        message.channel.send(listAlliances(message, alliances), { split: true });
	      });
	    });

	}
};