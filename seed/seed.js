if (process.env.NODE_ENV !== 'test') process.env.NODE_ENV = 'dev';

const mongoose = require('mongoose');
mongoose.Promise = Promise;
const request = require('superagent');
const parseString = require('xml2js').parseString;
const util = require('util');
const fs = require('fs');
const path = require('path');
const parseStringPromise = util.promisify(parseString);
const qs = require('querystring');
const {
    NET_URL
} = require('../config/config');
const {
    User,
    Account,
    Report
} = require('../models/index');

const userData = require('../data/users.json');
const reportData = require('../data/monthly-report.json')

// Connect to correct database for dev or testing
const DB_URL = `mongodb://localhost/ewallet-cashback-${process.env.NODE_ENV}`;

function seedDatabase(url) {

    return mongoose.connect(url)
        .then(() => {
            return mongoose.connection.dropDatabase()
        })
        .then(() => {

            const REPORTS = reportData.map(report => {
                
                report.member = {};
                report.period = report.period;
                report.member.member_name = report.member_name;
                report.member.member_deposits = report.member_deposits;
                report.member.member_trans_value = report.member_trans_value;
                report.member.member_commission = report.member_commission;
                report.member.member_cashback = report.member_commission * 0.785;

                delete report.member_name;
                delete report.member_deposits;
                delete report.member_trans_value;
                delete report.member_commission;               

                return report;
            })

            console.log(`Successfully seeded ${REPORTS.length} monthly reports for ${REPORTS[0].period} `);
            return Report.insertMany(REPORTS);

        })
        .then(() => {
            return Promise.all([User.insertMany(userData)])
        })
        .then(([users]) => {
            request
                .get(NET_URL)
                .then(report => {
                    console.log(`Successfully seeded ${users.length} user accounts`);
                    const urlQueries = qs.parse(report.request.url);
                    const xmlData = report.text;
                    return Promise.all([parseStringPromise(xmlData), urlQueries, users]);
                })
                .then(([accounts, urlQueries, users]) => {
                    return Promise.all([accounts['SOAP-ENV:Envelope']['SOAP-ENV:Body'][0].reportresponse[0].row, urlQueries, users]);
                })
                .then(([accounts, urlQueries, users]) => {

                    let netAccounts = [];

                    accounts.forEach(account => {
                        const netAccount = new Object();

                        let userNetId = users.find(user => {
                            return user.neteller_account_id === account.merchplayername[0];
                        });

                        netAccount.belongs_to = userNetId;
                        netAccount.member_name = account.merchplayername[0];
                        netAccount.reg_date = account.registrationdate[0];
                        account.playercountry[0] !== '' ? netAccount.country = account.playercountry[0] : netAccount.country = 'N/A';

                        netAccounts.push(netAccount);
                    });
                    return netAccounts;
                })

                .then(members => {
                    fs.writeFileSync(path.join(__dirname, '../data/accounts.json'), JSON.stringify(members, null, 4));
                    return members;
                })
                .then(members => {
                    console.log(`Successfully seeded ${members.length} Neteller accounts`);
                    return Account.insertMany(members);
                })
                .then(() => {
                    return mongoose.connection.close();
                })
                .catch(err => {
                    console.log(err);
                })
        })
        .catch(err => {
            console.log(err);
        })

}

seedDatabase(DB_URL)