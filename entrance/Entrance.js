var mongoose = require('mongoose');

var EntranceSchema = new mongoose.Schema({
    name: String,
    x: Number,
    y: Number
});

mongoose.model('Entrance', EntranceSchema);
module.exports = mongoose.model('Entrance');