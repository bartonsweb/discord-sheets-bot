const { Command } = require('discord.js-commando');

function buildMsgInfo(players) {
  let data = [];
  let string1 = '', string2 = '', str = '';

  let playersWithHb = players.filter(player => player.Homebase && player.Name);

  playersWithHb.forEach((player) => {

    str = `${player.Name} ${player.Homebase}/`;
    if ( str.length <= 90 ) {
        string1 += `${player.Name} ${player.Homebase}/`;
    } else {
        string2 += `${player.Name} ${player.Homebase}/`;
    }

  });
  data.push(string1)
  if (string2.length >= 1) data.push(string2)
  return data;
}

module.exports = class acCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'namecheck',
      aliases: ['alliancehbs', 'homebases'],
			group: 'spreadsheet',
			memberName: 'namecheck',
			description: 'List all players who have a HB coord + their name for name change checks.',
			guildOnly: true,
            throttling: {
                    usages: 5,
                    duration: 60
            },
			args: [
				{
					key: 'alliance',
					prompt: 'Which alliance would you like to lookup?',
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
	      message.client.spreadsheet.getAlliancePlayerFullData(alliance).then((data) => {
	        m.delete();
            if(!data) return message.channel.send("Oops. No data for that alliance found. \nIf you're sure it's right, please contact Erielia.");

            let msgs = buildMsgInfo(data)
            msgs.forEach(txt => txt &&  message.channel.send(txt))

	      });
	    });

	}
};