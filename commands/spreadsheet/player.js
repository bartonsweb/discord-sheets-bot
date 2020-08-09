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

function buildPlayerInfo(message, playerData) {
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
        ? playerData[base] + basePrefix
        : '*Sorry, no result for this yet!*';
    data.push(`*${base}:* ${string}`);

  });
  if( playerData.Comments || playerData.Updated_at ){ 
    data.push(`\n`) 
  }
  if( playerData.Comments ) {
    data.push(`**Comment:** *${playerData.Comments}*`)
  }
  if( playerData.Updated_at ) {
    data.push(`**Updated last:** ${playerData.Updated_at}`)
  }

  if( playerData.Alias ) {
    data.push(`**Alias (AKA):** ${playerData.Alias}`)
  }

  data.push(
    `\nYou can grab an alliance chat pasteable string using \`${message.client.options.commandPrefix}ac [name]\`.`,
  );

  return data;
}

module.exports = class playerCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'player',
			group: 'spreadsheet',
			memberName: 'player',
			description: 'List in-depth data that we have for [player].',
			guildOnly: true,
      throttling: {
            usages: 5,
            duration: 60
      },
			args: [
				{
					key: 'player',
					prompt: 'Which player would you like to lookup?',
					type: 'string',
				},
			],
		});
    this.roles = ['Member', 'BotAccess', 'botSemperFi', 'botDeadlyPoison'];
  }

  hasPermission(message) {
    if(this.roles && !message.member.roles.cache.some( r => this.roles.includes(r.name)) ) return 'You don\'t have the required role for this command.';
    return true
  }

	run(message, { player }) {
    let swornEnemyWhitelist = ['Semper Fi', 'Into The Fire_40', 'SF2'];
    let deadlyPoisonWhitelist = ['Deadly Poison', 'Rats_40'];
    
	    message.channel.send('Fetching, please wait...').then((m) => {
	      message.client.spreadsheet.getPlayerData(player).then((data) => {
	        m.delete();
          if(!data) return message.channel.send("Oops. No player by that name found. \nIf you're sure it's right, please contact Erielia.");


          if(data.Alliance === "Rejuvenation" && message.member.roles.cache.some(r => r.name === 'BotAdmin') === false ) return message.channel.send('You may not search for Rejuvenation players data.');
          
          if(message.member.roles.cache.some(r => r.name === 'botSemperFi') && !swornEnemyWhitelist.includes(data.Alliance)) {
            return message.channel.send('You may only search for Semper Fi players. Try again.');
          } else if (message.member.roles.cache.some(r => r.name === 'botDeadlyPoison') && !deadlyPoisonWhitelist.includes(data.Alliance)) {
            //console
            return message.channel.send('You may only search for Deadly Poison players here. Try again.');
          } else {
  	        return message.channel.send(buildPlayerInfo(message, data), { split: true });
          }
	      });
	    });

	}
};