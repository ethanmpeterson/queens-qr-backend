const express = require('express')
const app = express()
const dotenv = require('dotenv')

var port = process.env.PORT || 3000;

var result = 0;

if (port == 3000) {
    result = dotenv.config()
}

if (result != 0 && result.error) {
    throw result.error
}


var db = require('./db');

var BuildingController = require('./building/BuildingController');
app.use('/buildings', BuildingController);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

