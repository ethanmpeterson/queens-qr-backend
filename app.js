const express = require('express')
const app = express()
var db = require('./db');

var port = process.env.PORT || 3000;

//app.get('/', (req, res) => res.send('Hello World!'))

var BuildingController = require('./building/BuildingController');
app.use('/buildings', BuildingController);

app.listen(port, () => console.log(`Example app listening on port ${port}!`))

