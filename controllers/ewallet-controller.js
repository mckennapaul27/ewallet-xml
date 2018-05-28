const request = require('superagent');
const parseString = require('xml2js').parseString;
const {
    NET_URL
} = require('../config/config');
const util = require('util');
const parseStringPromise = util.promisify(parseString);
const qs = require('querystring');


function getAccountReport(req, res) {
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
        .then(([users, urlQueries]) => {

            let members = [];

            users.forEach(user => {
                const player = new Object();

                player.id = user.merchplayername[0];
                player.stats = {};
                player.details = {};
                player.stats.period_start = urlQueries.reportstartdate;
                player.stats.period_end = urlQueries.reportenddate;
                player.details.member_name = user.merchplayername[0];
                player.stats.commission = Math.round(user.Commission[0] * 100) / 100;
                player.stats.cashback = Math.round((user.Commission[0] * 0.785) * 100) / 100;
                player.details.reg_date = user.registrationdate[0];
                user.playercountry[0] !== '' ? player.details.country = user.playercountry[0] : player.details.country = 'N/A';
                player.stats.total_deposits = Math.round(user.Deposits[0] * 100) / 100;
                player.stats.transfer_value = Math.round(user.trans_value[0] * 100) / 100;
                player.stats.cashback_rate;
                player.stats.profit = Math.round((player.stats.commission - player.stats.cashback) * 100) / 100;
                if (player.stats.commission === 0) player.stats.cashback_rate = '0%';
                else player.stats.cashback_rate = ((player.stats.cashback / player.stats.transfer_value) * 100).toFixed(2) + '%';

                members.push(player);
            });
            return members;
        })

        .then(members => {
            console.log(members.length)
            return res.send({
                players: members
            });
        })

        .catch(err => {
            console.log(err);
        })
}

module.exports = {
    getAccountReport
}