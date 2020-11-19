var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');


var mongoose   = require('mongoose');
var dbUri = 'mongodb://localhost:27017/iot';

mongoose.Promise = global.Promise;
mongoose.connect(dbUri, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.connection.on('error', function(err) {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
});

mongoose.connection.on("connected", function() {
    console.log("connected to " + dbUri);

    mongoose.connection.db.listCollections().toArray(function(err,names){
        if(err){
            console.log(err);
        }
        else {
            console.log(names);
        }
    });
});


//var indexRouter = require('./routes/index');
//var testRouter = require('./routes/test');
var apiRouter = require('./routes/api');
// var ejsRouter = require('./routes/ejs');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.listen(3000); //Port number here
console.log('Express API Server running!');
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//app.use('/', indexRouter);
//app.use('/test', testRouter);
app.use('/api', apiRouter);
//app.use('/ejs', ejsRouter);

app.post("/", function(reg, res) {
    var name = reg.body.name;
    console.log("hello " + name);
    res.json({message:"hello " + name});
});
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
