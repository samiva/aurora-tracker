const { Int32 } = require('mongodb');
var mongoose     = require('mongoose'); //mongoDB liburary
var Schema       = mongoose.Schema; //

var VisibilitySchema   = new Schema({
    city: String,
    magnetic: Number,
    cloud: Number,
    signal: String,
    time: String
});

module.exports = mongoose.model('VisibilityModel', VisibilitySchema,'aurora-tracker-dev');
