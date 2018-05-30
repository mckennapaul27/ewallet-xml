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
const accountData = require('../data/accounts.json');
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
            console.log(`Successfully seeded ${users.length} user accounts`);

            const ACCOUNTS = accountData.map(account => {

                let userNetId = users.find(user => {
                    return user.neteller_account_id === account.member;
                });

                account.belongs_to = userNetId;
                account.account_id = account.member;
                account.reg_date = account.sign_up_date;
                account.membercountry !== '' ? account.country = account.membercountry : account.country = 'N/A';

                delete account.member;
                delete account.sign_up_date;
                delete account.membercountry;

                return account;
            })

            return Promise.all([Account.insertMany(ACCOUNTS)])
        })
        .then(([accounts]) => {
            console.log(`Successfully seeded ${accounts.length} Neteller accounts`);
        })
        .then(() => {
            return mongoose.connection.close();
        })     
        .catch(err => {
            console.log(err);
        })

}

seedDatabase(DB_URL)