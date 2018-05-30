// import models / db connections
const mongoose = require('mongoose');
const {Report, User} = require('../models/index');


// GET all the reports
function getAllReports (req, res, next) {
    return Report.find({})
    .then(allReports => {
        return res.status(200).send({reports: allReports})
    })
    .catch(() => next({status: 500, message: 'server error'}))
}

// GET reports by member_name
function getReportsByMemberName (req, res, next) {
    let memberName = req.params.member_name;
    return Report.find({'member.member_name': memberName})
    .then(reports => {              
        if (reports.length === 0) throw {status: 404, message: `Member name ${memberName} does not have any reports`}
        else return res.status(200).send({reports})
    })
    .catch(err => {
        if (err.status === 404) return next(err);
        else return next({status: 500, message: 'server error'});
    })
}


// GET reports by period
function getReportsByPeriod (req, res, next) {    
    let period = req.params.period[0].toUpperCase() + req.params.period.slice(1).toLowerCase();    
    return Report.find({period: period})
    .then(reports => {
        if (reports.length === 0) throw {status: 404, message: `There are no reports for the period: ${period}`}
        else return res.status(200).send({reports})
    })
    .catch(err => {
        if (err.status === 404) return next(err);
        else return next({status: 500, message: 'server error'});
    })
}


module.exports = {
    getAllReports,
    getReportsByMemberName,
    getReportsByPeriod
}