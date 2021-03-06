const { GoogleSpreadsheet } = require('google-spreadsheet');
const { getByValue } = require('./utilFuncs.js');

function equalsIgnoringCase(text, other) {
    if ( !text ) return false
    let str = text.replace(/\s?$/,'');
    return str.localeCompare(other, 'en', { sensitivity: 'base' }) === 0;
}

/**
 * 
 * @param {String} alias string of alias to check 
 * @param {String} playerName name to check 
 */
function aliasMatch(alias, playerName) {
  if ( alias === undefined || alias.length <= 0 ) return false
  let names = alias.split(', ')
  let match = false;
  names.forEach(name => {
    if ( equalsIgnoringCase(name, playerName) ) match = true
  })
  return match
}

class GoogleSheet {
    constructor(client) {
        this.client = client;

        this.doc = new GoogleSpreadsheet(process.env.SHEET_ID);

        this.loadSheet();

    }

    async loadSheet() {
        return await this.doc.useServiceAccountAuth({
            client_email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
            private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        }).then(d => this.doc.loadInfo())
    }

    async getPlayerData(playerName) {
        const sheet = this.doc.sheetsById[0];
        const rows = await sheet.getRows();
        const playerData = rows.find( row => row.Name && equalsIgnoringCase(row.Name, playerName) || ( row.Alias && aliasMatch(row.Alias, playerName) ) );
        return playerData
    }

    async getAlliancesList() {
          const sheet = this.doc.sheetsById[1574653053];
          const rows = await sheet.getRows();
          return [...new Set(rows.map( item => item.Alliance ) )];
    }

    async getAlliancePlayerData(query) {
      const alliance = await this.getAllianceName(query);
      const sheet = this.doc.sheetsById[0];
      const rows = await sheet.getRows();
      return {
        players: rows ? [...new Set(rows.filter( row => row.Name && row.Alliance && equalsIgnoringCase(row.Alliance, alliance) ) )].map((item) => item.Name) : undefined,
        alliance: alliance
      }
    }

    async getAllianceName(query) {
      const allysheet = this.doc.sheetsById[1574653053];
      const allyRows = await allysheet.getRows();
      const allyRow = [...new Set(allyRows.filter(row => {
        if ( equalsIgnoringCase(row.Alliance, query) ) return row
        if ( aliasMatch(row.allianceAlias, query) ) return row
        if ( equalsIgnoringCase(row.allianceAbbr, query) ) return row
        return false
      }))]
      return allyRow ? allyRow[0].Alliance : undefined
    }

    async getAlliancePlayerFullData(query) {
      const alliance = await this.getAllianceName(query);

      const sheet = this.doc.sheetsById[0];
      const rows = await sheet.getRows();
      return rows ? [...new Set(rows.filter( row => row.Name && row.Alliance && equalsIgnoringCase(row.Alliance, alliance) ) )] : undefined;

    }

    async getCoordinate(coordinate) {
        const sheet = this.doc.sheetsById[0];
        const rows = await sheet.getRows();
        //const isValidCoord = getByValue(rows, coordinate)
            var o;

            for (var i=0, iLen=rows.length; i<iLen; i++) {
                o = rows[i];

                for ( var p in o ) {
                    if ( o.hasOwnProperty(p) && o[p] === coordinate ) {
                        return o;
                    }
                }
            }
        //console.log(isValidCoord);
    }

    async getMissingHBPlayers(alliance) {
      const sheet = this.doc.sheetsById[0];
      const rows = await sheet.getRows();
      if( alliance ) {
        return [...new Set( rows.filter( row => !row.Homebase && row.Name && row.Alliance && equalsIgnoringCase(row.Alliance, alliance) ) ) ];
      } else {
        return [...new Set( rows.filter( row => !row.Homebase && row.Name ) ) ];
      }
    }

}

module.exports = GoogleSheet;