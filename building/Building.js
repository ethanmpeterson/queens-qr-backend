var mongoose = require('mongoose');
var Service = require('../service/Service');
var BuildingSchema = new mongoose.Schema({
    name: String,
    address: String,
    faculty: String,
    hours: Object,
    history: String,
    alias: [{
        type: String,
    }],
    services: [{
        type: Object
    }],
    entrances: [{
        type: Object
    }]
});
mongoose.model('Building', BuildingSchema);
module.exports = mongoose.model('Building');