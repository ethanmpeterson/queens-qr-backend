var mongoose = require('mongoose');

var EntranceSchema = new mongoose.Schema({
    name: String,
    pos: Object
});
mongoose.model('Entrance', EntranceSchema);
module.exports = mongoose.model('Entrance');