var mongoose = require('mongoose');

var BuildingSchema = new mongoose.Schema({
    name: String,
    address: String,
    faculty: String,
    hours: String,
    history: String,
    alias: [{
        type: String,
    }],
    services: [{
        type: String
    }],
    
});
mongoose.model('Building', BuildingSchema);
module.exports = mongoose.model('Building');