const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const apiRouter = require('./routers/api.router');

app.set('view engine', 'ejs');

app.use(express.static('public'));

app.use(bodyParser.json());

app.use('/api', apiRouter);


app.listen(PORT, () => {
    console.log(`App listening on port ${3000}...`);
});