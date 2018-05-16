const request = require('superagent');
const parseString = require('xml2js').parseString;
const {NET_URL} = require('../config/config');
const util = require('util');
const parseStringPromise = util.promisify(parseString);


function getAccountReport (req, res) { 
    request
    .get(NET_URL)
    .then(report => {        
        const xmlData = report.text;        
        return parseStringPromise(xmlData);
    })
    .then(data => {
        return data['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0].reportresponse[0].row;
    })
    .then(users => {
        let memberids = [];
        users.forEach(user => {
            const player = new Object();
            
            player.member_name = user.merchplayername[0]; 
            player.commission = user.Commission[0];
            player.reg_date = user.registrationdate[0];
            user.playercountry[0] === null ? player.country = user.playercountry[0] : player.country = 'N/A';
            player.total_deposits = user.Deposits[0];
            player.transfer_value = user.trans_value[0];

            memberids.push(player);             
        });        
        return memberids;
    }) 

    .then(members => {
        return res.send({players: members}); 
    })
  
    .catch(err => {
        console.log(err);
    })
}

module.exports = {
    getAccountReport
}