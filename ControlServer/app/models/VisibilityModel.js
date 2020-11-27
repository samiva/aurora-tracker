const { Int32 } = require('mongodb');
var mongoose     = require('mongoose'); //mongoDB liburary
var Schema       = mongoose.Schema; //

var VisibilitySchema   = new Schema({
    geomagnetic: Number,
    location: String,
    signal: String,
    timestamp: String
});

module.exports = mongoose.model('VisibilityModel', VisibilitySchema,'aurora-tracker-dev');
