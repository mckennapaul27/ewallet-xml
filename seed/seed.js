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
    Account
} = require('../models/index');

// Connect to correct database for dev or testing
const DB_URL = `mongodb://localhost/ewallet-cashback-${process.env.NODE_ENV}`;

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
           // console.log(members)        
            fs.writeFileSync(path.join(__dirname, 'accounts.json'), JSON.stringify(members, null, 4));
            return members;
        })

        .catch(err => {
            console.log(err);
        })
}



function seedDatabase(url) {
    return Promise.all([getAccountReport()])
    console.log('start')
        

        // .then(members => {
        //     return Promise.all([members, mongoose.connect(url)])
        // })
        .then(([members]) => {
            console.log(members)
            //return Account.insertMany(members);
        })
        // .then(() => {
        //     //mongoose.connection.close();
        // })
        .catch(err => {
            console.log(err);
        })
}

seedDatabase(DB_URL)

module.exports = {
    getAccountReport
}