const { Command } = require('discord.js-commando');

const bases = [
  'Homebase',
  'Alpha',
  'Bravo',
  'Charlie',
  'Delta',
  'Echo',
  'Foxtrot',
  'Tango',
  'Romeo',
  'Victor',
  'Zulu',
];

const baseMap = {
  'Homebase': 'HB',
  'Alpha': 'A',
  'Bravo': 'B',
  'Charlie': 'C',
  'Delta': 'D',
  'Echo': 'E',
  'Foxtrot': 'F',
  'Tango': 'T',
  'Romeo': 'R',
  'Victor': 'V',
  'Zulu': 'Z',
}

const prefixMap = {
  O34: 'O/s 34',
  N34: 'N/s 34',
  O38: 'O/s 38',
  N38: 'N/s 38',
  P: 'Port',
};

function listPlayers(message, players) {
  const data = [];
  players.forEach((player) => {
  	let string = `**${player.Name}**:- `;
  	bases.forEach(base => {
		string += ` ${baseMap[base]}/ ${player[base] ? player[base] : '?'} ${player[base.toLowerCase() + 'Prefix'] ? prefixMap[player[base.toLowerCase() + 'Prefix']] : ''}`
  	});
  	data.push(string);
  	data.push(` `);
  });

  return data;
}


module.exports = class alliancesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'allplayers',
			group: 'spreadsheet',
			memberName: 'allplayers',
			description: 'List all players in an alliance that we have any data for.',
			guildOnly: true,
			throttling: {
                usages: 1,
                duration: 3000
            },
			args: [
				{
					key: 'alliance',
					prompt: 'Which alliance would you like to output?',
					type: 'string',
				},
			],
		});
		this.roles = ['BotAdmin'];
	}

	hasPermission(message) {
		if(this.roles && !message.member.roles.cache.some( r => this.roles.includes(r.name)) ) return 'You don\'t have the required role for this command.';
		return true
	}

	run(message, { alliance }) {
		
	    message.channel.send('Fetching, please wait...').then((m) => {
	      message.client.spreadsheet.getAlliancePlayerFullData(alliance).then((players) => {
	        m.delete();
	        message.channel.send(listPlayers(message, players), { split: true });
	      });
	    });

	}
};