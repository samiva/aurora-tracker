var express   = require('express');
var router    = express.Router();
var UserModel = require('../models/signalModel.js');

router.get('/test', function (req, res) {
    res.json({
        message:"This is api test"
    });
});

router.post('/',function(req,res){
    var User = new UserModel()

    User.index = req.body.index;
    User.signal = req.body.signal;
    User.door =  req.body.door;
    User.ota =  req.body.ota;
    User.location =  req.body.location;
    User.group =  req.body.group;
    User.ipaddress =  req.body.ipaddress;
    User.power =  req.body.power;

    // 
    User.save(function(err) {
        if (err){
            
            res.send(err);
        } else {
           
            res.json({ message: 'Success!!' });
        }
    });
});

router.get('/', function (req, res) {
    UserModel
        .find()
        .then(function (users) {
            res.json(users);
        });
});

router.get('/:index', function (req, res) {
    var Userindex = req.params.index;
    UserModel
        .findOne({index: Userindex},function (err,user) {
            res.json(user);
        });
});

router.get('/ota/:ota', function (req, res) {
    var Userindex = req.params.ota;
    UserModel
        .find({ota: Userindex},function (err,users) {
            res.json(users);
        });
});



router.get('/:index/changesignal/:signal', function (req, res) {
    var Userid = req.params.index;
    var Usersignal = req.params.signal;

    UserModel
    .findOne({index: Userid}, function(err, user) {
        if (err) {
            res.send(err);
        } else {
            //Signal color update
            user.signal = Usersignal;
    
            user.save(function(err) {
                if (err){
                    res.send(err);
                } else {
                    res.json({ message: 'Change Success!'+ Userid + Usersignal + user });
                }
            });
        }
    });

});

router.get('/:index/onair', function (req, res) {
    var Userid = req.params.index;

    UserModel
    .findOne({index: Userid}, function(err, user) {
        if (err) {
            res.send(err);
        } else {
            //Signal color update
            user.signal = "red";
    
            user.save(function(err) {
                if (err){
                    res.send(err);
                } else {
                    res.json({ message: 'Change Success! '+ Userid + ':ON-AIR' + user });
                }
            });
        }
    });

});

router.get('/:index/power/:power', function (req, res) {
    var Userid1 = req.params.index;
    var Userid2 = req.params.power;

    UserModel
    .findOne({index: Userid1}, function(err, user) {
        if (err) {
            res.send(err);
        } else {
            //Signal color update
            user.power = Userid2;
    
            user.save(function(err) {
                if (err){
                    res.send(err);
                } else {
                    res.json({ message: 'Change Success! '+ Userid2 + ':ON-AIR' + user });
                }
            });
        }
    });

});

router.delete('/:index',function(req,res){
    var Userid = req.params.index;
    UserModel.deleteOne({index: Userid})
        .then(function(){
            res.json({message:'Success!!'});
        });
});

router.delete('/id/:_id',function(req,res){
    var Userid = req.params._id;
    UserModel.deleteOne({_id: Userid})
        .then(function(){
            res.json({message:'Success!!'});
        });
});

router.put('/:index',function (req, res) {

    var Userid = req.params.index;

    UserModel
        .findOne({index: Userid}, function(err, user) {
            if (err) {
                res.send(err);
            } else {

                //user.index = req.body.index;

                user.door = req.body.door;
                user.ota =  req.body.ota;
                user.location =  req.body.location;
                user.group =  req.body.group;
                user.ipaddress =  req.body.ipaddress;
                user.power =  req.body.power;
                
                user.save(function(err) {
                    if (err){
                        res.send(err);
                    } else {
                        res.json({ message: 'Success!' });
                    }
                });
            }
        });

});

module.exports = router;

