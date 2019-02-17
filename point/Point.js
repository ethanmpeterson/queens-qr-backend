var mongoose = require('mongoose');

var PointSchema = new mongoose.Schema({
    x: Number,
    y: Number
});
mongoose.model('Point', PointSchema);
module.exports = mongoose.model('Point');