
const request = require('superagent');
const parseString = require('xml2js').parseString;
const util = require('util');
const parseStringPromise = util.promisify(parseString);
const qs = require('querystring');
const {
    NET_URL
} = require('../config/config');

function getAccountReport() {
    request
        .get(NET_URL)
        .then(report => {
            const urlQueries = qs.parse(report.request.url);
            const xmlData = report.text;
            return Promise.all([parseStringPromise(xmlData), urlQueries]);
        })
        .then(([data, urlQueries]) => {
            return Promise.all([data['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0].reportresponse[0].row, urlQueries]);
        })
        .then(([accounts, urlQueries]) => {

            let netAccounts = [];

            accounts.forEach(account => {
                const netAccount = new Object();

                netAccount.member_name = account.merchplayername[0];
                netAccount.reg_date = account.registrationdate[0];
                account.playercountry[0] !== '' ? netAccount.country = account.playercountry[0] : netAccount.country = 'N/A';

                netAccounts.push(netAccount);
            });
            return netAccounts;
        })

        .then(members => {                     
            return members;
        })

        .catch(err => {
            console.log(err);
        })
}

module.exports = getAccountReport;