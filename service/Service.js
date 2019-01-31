var mongoose = require('mongoose');

var ServiceSchema = new mongoose.Schema({
    name: String,
    room_number: String,
    faculty: String,
    hours: String,
    description: String,
});
mongoose.model('Service', ServiceSchema);
module.exports = mongoose.model('Service');

