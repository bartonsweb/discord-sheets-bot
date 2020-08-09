const { Command } = require('discord.js-commando');

function buildPlayerInfo(message, playerData, searchTerm) {
  let data = [];

  data.push(`**Known names for ${searchTerm}**`);

  data.push(`Current Name: ${playerData.Name}`);
  data.push(`Known Alias': ${playerData.Alias}`)


  data.push(
    `\nYou can grab an alliance chat pasteable string using \`${message.client.options.commandPrefix}ac [name]\`.`,
  );
  return data
}

module.exports = class acCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'aka',
			group: 'spreadsheet',
			memberName: 'aka',
			description: 'Search for a player via name or known name. For example Mustard AKA JPT could be listed with `!aka Mustard`',
			guildOnly: true,
      throttling: {
            usages: 5,
            duration: 60
      },
			args: [
				{
					key: 'player',
					prompt: 'Which player/alias would you like to lookup?',
					type: 'string',
				},
			],
		});
    this.roles = ['Member', 'BotAccess', 'botSemperFi'];
  }

  hasPermission(message) {
    if(this.roles && !message.member.roles.cache.some( r => this.roles.includes(r.name)) ) return 'You don\'t have the required role for this command.';
    return true
  }

	run(message, { player }) {
    let swornEnemyWhitelist = ['Semper Fi', 'Into The Fire_40', 'SF2'];
		
	    message.channel.send('Fetching, please wait...').then((m) => {
	      message.client.spreadsheet.getPlayerData(player).then((data) => {
	        m.delete();
          if(!data) return message.channel.send("Oops. No player/alias by that name found. \nIf you're sure it's right, please contact Erielia.");

          if(message.member.roles.cache.some(r => r.name === 'botSemperFi') && !swornEnemyWhitelist.includes(data.Alliance)) {
            return message.channel.send('You may only search for Semper Fi players. Try again. Dick.');
          } else if(message.member.roles.cache.includes('botDeadlyPoison') && message.channel.id === '741940911658893364' && !['Deadly Poison', 'Rats_40'].includes(data.Alliance)) {
            //console
            return message.channel.send('You may only search for Deadly Poison players here. Try again. Dick.');
          } else {
            return message.channel.send(buildPlayerInfo(message, data, player), { split: true });
          }
	      });
	    });

	}
};