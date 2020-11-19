const { Int32 } = require('mongodb');
var mongoose     = require('mongoose'); //mongoDB liburary
var Schema       = mongoose.Schema; //

var VisibilitySchema   = new Schema({
    visibility: Number,
    location: String,
    timestamp: String
});

module.exports = mongoose.model('VisibilityModel', VisibilitySchema,'aurora-tracker-dev');
