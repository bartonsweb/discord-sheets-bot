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

function buildPlayerInfo(playerData) {
  let data = [];
  let string1 = '', string2 = '', str = '';

  string1 = `${playerData.Name} - `;

  bases.forEach((base) => {

    str = `${string1} ${playerData[base.toLowerCase() + 'Prefix'] === 'P' ? baseMap[base] + '/' + playerData[base] + ' P ' : playerData[base] !== undefined ? 'baseMap[base]' + '/' + playerData[base] + ' ' : baseMap[base] + '/ ? '}`;
    if ( str.length <= 100 ) {
      string1 += playerData[`${base.toLowerCase()}Prefix`] === 'P' ? `${baseMap[base]}/ ${playerData[base]} P ` : playerData[base] !== undefined ? `${baseMap[base]}/ ${playerData[base]} ` : `${baseMap[base]}/ ? `;
    } else {
      string2 += playerData[`${base.toLowerCase()}Prefix`] === 'P' ? `${baseMap[base]}/ ${playerData[base]} P ` : playerData[base] !== undefined ? `${baseMap[base]}/ ${playerData[base]} ` : `${baseMap[base]}/ ? `;
    }

  });
  data.push(string1)
  if (string2.length >= 1) data.push(string2)
  return data;
}

module.exports = class acCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'ac',
			group: 'spreadsheet',
			memberName: 'ac',
			description: 'List alliance chat pasteable string for [player]. Split by AC character limit.',
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
        var players = player.split(/\s?[, ]\s?/);
        players.forEach(p => {
          message.client.spreadsheet.getPlayerData(p).then((data) => {
           
            if (!data) return message.channel.send(`Oops. No player by that name (${p}) found. \nIf you're sure it's right, please contact Erielia.`);

            if (data.Alliance === "Rejuvenation" && message.member.roles.cache.some(r => r.name === 'BotAdmin') === false ) return message.channel.send('You may not search for Rejuvenation players data.');

            if (message.member.roles.cache.some(r => r.name === 'botSemperFi') && !swornEnemyWhitelist.includes(data.Alliance)) {
              return message.channel.send('You may only search for Semper Fi players. Try again.');
              //Else if channel is deadly-poison
            } else if (message.member.roles.cache.some(r => r.name === 'botDeadlyPoison') && !deadlyPoisonWhitelist.includes(data.Alliance)) {
              return message.channel.send('You may only search for Deadly Poison players here. Try again.');
            } else {
              let msgs = buildPlayerInfo(data)
              msgs.forEach(txt => message.channel.send(txt))
            }
          }); //end getPlayerData
                 
        }); //end foreach
      m.delete();  
	    }); //end send Fetch message

	}
};