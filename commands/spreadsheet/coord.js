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

const prefixMap = {
  O34: 'Old 34 Sub',
  N34: 'New 34 Sub',
  O38: 'Old 38 Sub',
  N38: 'New 38 Sub',
  P: 'Port base',
};

function buildPlayerInfo(message, coord, playerData) {
  const data = [];
  data.push(`**--- ${playerData.Name} ---**`);
  if (playerData.Alliance) {
    data.push(`**Alliance:** ${playerData.Alliance}`);
  }
  if (playerData.Timezone) {
    data.push(`**Timezone:** ${playerData.Timezone}`);
  }
  if (playerData.Warcom) {
    data.push(`**Warcom:** ${playerData.Warcom} Unit Damage`);
  }
  if (playerData.Warcom || playerData.Alliance || playerData.Warcom) {
    data.push('\n');
  }

  bases.forEach((base) => {
    const basePrefix =
      base != 'Homebase' && playerData[`${base.toLowerCase()}Prefix`]
        ? ` - ${prefixMap[playerData[`${base.toLowerCase()}Prefix`]]}`
        : '';
    const string =
      playerData[base] != ''
        ? playerData[base] === coord ? '***' + playerData[base] + '***' : playerData[base] + basePrefix
        : '*Sorry, no result for this yet!*';
    data.push(`*${base}:* ${string}`);

  });

	if( playerData.Comments ) {
	  data.push(`\n\n**Comment:** *${playerData.Comments}*`)
	}
	if( playerData.Updated_at) {
	  data.push(`*Updated at: ${playerData.Updated_at}`)
	}

  data.push(
    `\nYou can grab an alliance chat pasteable string using \`${message.client.options.commandPrefix}ac [name]\`.`,
  );

  return data;
}


module.exports = class alliancesCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'coord',
			group: 'spreadsheet',
			memberName: 'coord',
			description: 'Search for a specific coordinate and find who owns it.',
			guildOnly: true,
			args: [
				{
					key: 'coord',
					prompt: 'Which coordinate are you searching for?',
					type: 'string',
				},
			],
			throttling: {
                usages: 10,
                duration: 1800
            }
		});
		this.roles = ['Member', 'BotAccess'];
	}

	hasPermission(message) {
		if(this.roles && !message.member.roles.cache.some( r => this.roles.includes(r.name)) ) return 'You don\'t have the required role for this command.';
		return true
	}

	run(message, { coord }) {
		
	    message.channel.send('Fetching, please wait...').then((m) => {
	      message.client.spreadsheet.getCoordinate(coord).then((data) => {
	        m.delete();
	        data ? message.channel.send(buildPlayerInfo(message, coord, data), { split: true }) : message.channel.send("Oops. No coordinate found. \nPerhaps we don't have it stored yet.\nBut double check you typed it right, including any \"-\" signs");
	        //message.channel.send(listAlliances(message, alliances), { split: true });
	      });
	    });

	}
};