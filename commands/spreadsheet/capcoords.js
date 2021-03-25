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
    O34: 'Old 34 Sub',
    N34: 'New 34 Sub',
    O38: 'Old 38 Sub',
    N38: 'New 38 Sub',
    P: 'Port base',
  };
const whitelist = [ 'O34', 'N34', 'O38', 'N38', 'C' ];
  
  function buildMsgInfo(allianceData) {
    let data = [];
    let str = '', i = 0;
  
    allianceData.forEach((player) => {
      console.log(player);
      bases.forEach((base) => {
        if( player[base] && whitelist.includes( player[`${base.toLowerCase()}Prefix`] ) ) {
            str = `${data[i] ? data[i] : ''} ${player[base]} `;
            if ( str.length <= 100 ) {
                data[i] = str;
            } else {
                data[i + 1] = `${player[base]} `;
                i++;
            }

        }

      });

    });

    return data;
}

module.exports = class capcoords extends Command {
	constructor(client) {
		super(client, {
			name: 'capcoords',
			group: 'spreadsheet',
			memberName: 'capcoords',
			description: 'List all SBs in an alliance that we have any data for.',
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
	      message.client.spreadsheet.getAlliancePlayerFullData(alliance).then((data) => {
	        m.delete();
            if(!data) return message.channel.send("Oops. No data for that alliance found. \nIf you're sure it's right, please contact Erielia.");

            let msgs = buildMsgInfo(data)
            msgs.forEach(txt => txt &&  message.channel.send(txt))
	      });
	    });

	}
};