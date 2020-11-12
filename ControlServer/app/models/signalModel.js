var mongoose     = require('mongoose'); //mongoDB liburary
var Schema       = mongoose.Schema; //

var UserSchema   = new Schema({
    index :String,
    signal : String,
    door : String,
    ota : String,
    location : String,
    group : String,
    ipaddress : String,
    power : String,
});

module.exports = mongoose.model('UserModel', UserSchema);
