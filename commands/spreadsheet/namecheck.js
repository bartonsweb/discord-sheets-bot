const { Command } = require('discord.js-commando');


function buildMsgInfo(players) {
  let data = [];
  let str = '', i = 0;

  let playersWithHb = players.reduce( (filtered, player) => {
    if (player.Homebase && player.Name ) {
      var newValue = { Name: player.Name, Homebase: player.Homebase }
      filtered.push(newValue);
    }
    return filtered;
  }, []);

  playersWithHb.forEach((player) => {
    str = `${data[i] ? data[i] : ''} ${player.Name} ${player.Homebase}/`;
    if ( str.length <= 100 ) {
        data[i] = str;
    } else {
        data[i + 1] = `${player.Name} ${player.Homebase}/`;
        i++;
    }
  });
  return data;
}

module.exports = class acCommand extends Command {
	constructor(client) {
		super(client, {
			name: 'namecheck',
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