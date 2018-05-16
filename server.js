const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000;
const ewalletRouter = require('./routers/ewallet.router');

app.use(bodyParser.json());

app.use('/api', ewalletRouter);






app.listen(PORT, () => {
    console.log(`App listening on port ${3000}...`);
});