const express = require('express');
const router = express.Router();
const {
    getAllReports,
    getReportsByMemberName,
    getReportsByPeriod
} = require('../controllers/report.controller');

// GET all the reports
router.get('/', getAllReports);

// GET reports by member_name
router.get('/member/:member_name', getReportsByMemberName);

// GET reports by period
router.get('/period/:period', getReportsByPeriod);

module.exports = router;