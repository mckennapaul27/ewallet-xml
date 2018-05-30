if (process.env.NODE_ENV !== 'test') process.env.NODE_ENV = 'dev';

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const apiRouter = require('./routers/api.router');
const {
    DB_URL
} = require('./config/config');


mongoose.connect(DB_URL, (err) => {
    if (err) console.log(err);
    else console.log(`Connected to ${DB_URL}`);
});

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.json());

app.get('/register', (req, res, next) => {
    return res.render('pages/form');
})

app.use('/api', apiRouter);

app.use((err, req, res, next) => {
    if (res.status !== 500) {
        return res.status(err.status).send({
            error: err.message
        });
    }
});

// catch all error handler - any 500 errors
app.use(function (err, req, res, next) {
    return res.status(500).send({
        error: err.message
    });
});

app.listen(PORT, () => {
    console.log(`App listening on port ${3000}...`);
});