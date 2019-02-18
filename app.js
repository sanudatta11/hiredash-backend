var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const swaggerUi = require('swagger-ui-express');
var cors = require('cors');
var logger = require('morgan');
var mongoose = require('mongoose');
var compression = require('compression');

var router = require('./routes/router');
let userRoute = require('./routes/userRoute');
let companyRoute = require('./routes/companyRouter');
let BaseURL = "https://api.hiredash.tech/";
var Linkedin = require('node-linkedin')('814yacdk68651y', 'XLxay5VcmZYWaYAG', BaseURL + 'oauth/linkedin/callback');

var app = express();
var server = require('http');
let swaggerDocument = require('./docs/hireDashDoc');
// database connection
let options = {
    useNewUrlParser: true
};


mongoose.Promise = global.Promise;

mongoose.connect('mongodb+srv://admin:dhAmOaPWIiZC4ZRj@hiredash-hbiqb.mongodb.net/hiredash?retryWrites=true', options);
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log('We\'re connected!');
});
app.use(cors());
app.use(compression());
app.options('*', cors());
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
var scope = ['r_basicprofile', 'r_emailaddress'];

//LinkedIn Callback
app.get('/oauth/linkedin', userRoute.loginLinkedInApplicant);
app.get('/oauth/linkedin/callback', userRoute.loginLinkedInApplicantCallBack);

app.post('/loginApplicant',userRoute.loginApplicant);
app.post('/loginRecruiter',userRoute.loginRecruiter);

//First Create Company then create User
app.post('/createCompany',companyRoute.createCompany);
app.post('/createUserRecruiter',userRoute.createUserRecruiter);

app.use('/api',router);
app.use('/', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
// catch 404 and forward to error handler -- Error Handler Rest API
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.json(err);
});


var port = process.env.port || 8000;
var backend = server.createServer(app).listen(port,'0.0.0.0');

module.exports = app;
