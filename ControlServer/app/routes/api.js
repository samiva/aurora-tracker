var express   = require('express');
const VisibilityModel = require('../models/VisibilityModel.js');
var router    = express.Router();
var VisibiltyModel = require('../models/VisibilityModel.js');
const RequestIp = require('@supercharge/request-ip')

router.get('/test', function (req, res) {
    res.json({
        message:"This is api test"
    });
});

router.post('/',function(req,res){
    var User = new VisibiltyModel()

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
const expressMiddleware = function(req, res, next) {
    req.ip = RequestIp.getClientIp(req);
    console.log('middleware:',req.ip);
    next();
}
router.use(expressMiddleware);


/*router.get('/device', function(req, res) {
    var ipAddr = req.ip.toString();
    ipAddr = ipAddr.substr(ipAddr.lastIndexOf(':')+1);    
    res.json(ipAddr);
})
*/
// Phong: main python loop to update geomagnetic information every 30s
//
router.get('/device', function(req, res) {
    var ipAddr = req.ip.toString();
    ipAddr = ipAddr.substr(ipAddr.lastIndexOf(':')+1);
    console.log('ipAddr' + ipAddr);
    const { spawn } = require('child_process'); 
    //const toolParams = JSON.stringify(params);
    console.log('spawn child process');
    // TODO: connect to MongoDB using IP address - Sami
	// Update aurora status for current city
	// Or create a new city
    const pythonProcess = spawn('python3', [__dirname + '/updateAurora_IPbased.py', ipAddr]); 
    const stdout = [];
    const stderr = [];
    console.log('Call python');

    pythonProcess.stdout.on('data', data => { stdout.push(data.toString()) }); 
    pythonProcess.stderr.on('data', data => { stderr.push(data.toString()) });
    pythonProcess.on('close', (code) => { 
   	if (code !== 0) { 
    		const errorMessage = stderr.join(''); 
    		res.end(errorMessage); 
  	} 
        
  	const pythonResult = JSON.parse(stdout.toString());
    	// Exploit pythonResult 
	console.log(pythonResult.city);
	console.log(pythonResult.color);
	//res.json(pythonResult)
	
    });
    var User_city = pythonResult.city;
    var Usersignal = pythonResult.color;

    VisibiltyModel.findOne({location: User_city}, function(err, user) {
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
})

router.get('/ipbased', function(req, res) {
    var ipAddr = req.ip.toString();
    ipAddr = ipAddr.substr(ipAddr.lastIndexOf(':')+1);
    console.log('ipAddr' + ipAddr);
    const { spawn } = require('child_process');
    //const toolParams = JSON.stringify(params);
        console.log('spawn child process');
    const pythonProcess = spawn('python3', [__dirname + '/updateAurora_IPbased.py', ipAddr]);
    const stdout = [];
    const stderr = [];
    console.log('Call python');

    pythonProcess.stdout.on('data', data => { stdout.push(data.toString()) });
    pythonProcess.stderr.on('data', data => { stderr.push(data.toString()) });
    pythonProcess.on('close', (code) => {
        if (code !== 0) {
                const errorMessage = stderr.join('');
                res.end(errorMessage);
        }

        const pythonResult = JSON.parse(stdout.toString());
        // Exploit pythonResult
        console.log(pythonResult.city);
        console.log(pythonResult.color);
        res.json(pythonResult)

    });

})


router.get('/test', function (req, res) {
    res.json({
        message:"This is api test"
    });
});

router.get('/auroras/:location', function (req, res) {
    var loc = req.params.location;
    console.log("location:", loc);
    VisibilityModel.
	findOne({location:loc}, function(err, visibility){
        if(err){
            console.log("failed for", loc);
            res.json({messeage:"Failed"})
        }
        console.log("No error:", visibility);
        res.json(visibility);
    });
});

router.get('/auroras', function(req,res){
    VisibilityModel
	.find()
	.then(function (users) {
		res.json(users);
	});

//    console.log("Auroras");
//    console.log("Auroras ", req.query.location);
});

router.get('/add_device/:location', function(req,res){
    var loc = req.params.location;
    VisibilityModel.countDocuments({location:loc}, function(err,count) {
        console.log("count:",count);
        if(count<1) {
            var visibility = new VisibilityModel();
            visibility.location=loc;
            visibility.timestamp = Date.now().toString();
            visibility.save(function(err) {
                if(err){
                    res.send(err);
                } else {
                    res.json({message:"success"});
                }
            });                        
        }
    })
});

router.get('/', function (req, res) {
    // VisibiltyModel
    //     .find()
    //     .then(function (users) {
    //         res.json(users);
    //     });
    console.log("Hello");
});

router.get('/:index', function (req, res) {
    var Userindex = req.params.index;
    VisibiltyModel
        .findOne({index: Userindex},function (err,user) {
            res.json(user);
        });
});

router.get('/ota/:ota', function (req, res) {
    var Userindex = req.params.ota;
    VisibiltyModel
        .find({ota: Userindex},function (err,users) {
            res.json(users);
        });
});



router.get('/auroras/:location/changesignal/:signal', function (req, res) {
    var Userid = req.params.location;
    var Usersignal = req.params.signal;

    VisibiltyModel
    .findOne({location: Userid}, function(err, user) {
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

    VisibiltyModel
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

    VisibiltyModel
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
    VisibiltyModel.deleteOne({index: Userid})
        .then(function(){
            res.json({message:'Success!!'});
        });
});

router.delete('/id/:_id',function(req,res){
    var Userid = req.params._id;
    VisibiltyModel.deleteOne({_id: Userid})
        .then(function(){
            res.json({message:'Success!!'});
        });
});

router.put('/:index',function (req, res) {

    var Userid = req.params.index;

    VisibiltyModel
        .findOne({index: Userid}, function(err, user) {
            if (err) {
                res.send(err);
            } else {

                user.signal = req.body.signal;
                user.location =  req.body.location;

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

