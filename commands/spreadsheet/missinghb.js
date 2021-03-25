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

function buildPlayerInfo(message, playerData, alliance) {
  const data = Array(10).fill('');
  let num = 1;

  data[0] += (`**--- All players missing homebase coordinates${alliance ? ' for ' + alliance : ''} ---**`);
  playerData.forEach(player => {
      if( data[num] && data[num].length <= 83 ) {
        data[num] += `${player.Name} ${!alliance && player.Alliance !== undefined ? "- " + player.Alliance + ' ' : ''}`
      } else {
        num++
        data[num] += `${player.Name} ${!alliance && player.Alliance !== undefined ? "- " + player.Alliance + ' ' : ''}`
      }
  })

  return data;
}

module.exports = class playerCommand extends Command {
  constructor(client) {
    super(client, {
      name: 'missinghb',
      group: 'spreadsheet',
      memberName: 'missinghb',
      description: 'List homebases that we do not have data for.',
      guildOnly: true,
      alias: ['hb'],
      throttling: {
            usages: 5,
            duration: 60
      },
      args: [
        {
          key: 'alliance',
          prompt: 'Which alliance would you like to search by?',
          type: 'string',
          default: ''
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
        message.client.spreadsheet.getMissingHBPlayers(alliance).then((data) => {
          m.delete();
          if (data ) {
            let msgs = buildPlayerInfo(message, data, alliance)
            msgs.forEach( txt => {
              return txt ? message.channel.send(txt) : undefined
            })
          } else {
            message.channel.send("No results found. Maybe there are no missing Homebase coords?");
          }
        });
      });

  }
};