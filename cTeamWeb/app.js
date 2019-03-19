var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var exphbs = require('express-handlebars');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var fs = require('fs');
var mysql = require('mysql');

/*
//Connect to Mysql db
var db = mysql.createConnection({
  host     : 'cteamteamprojectdatabase.csed5aholavi.eu-west-2.rds.amazonaws.com',
  user     : 'nodeserver',
  password : '54Tjltl9LgSWHxrx2AVo',
 // database : 'cTeamTeamProjectDatabase'
   ssl  : {
    ca : fs.readFileSync(__dirname + '/ca/rds-combined-ca-bundle.pem' )
  }
});


db.connect(function(err) {
  if (err) {
    console.log('Mysql Connection error:', err);
  }
  else{
  	console.log('Mysql Connected');
  }
  
});

db.query('SELECT * FROM cTeamTeamProjectDatabase.Users', function (err, result) {
    if (err){
    	console.log(err);
    }
    else{
    	console.log(result);
    }

    });
*/

/*

var resultDB; 

var fieldsDB;

var errDB;

var users = "nsfranklin";

db.connect(function(errDB) {
  if (errDB) throw errDB;
  db.query('SELECT * FROM cTeamTeamProjectDatabase.Orders', function (errDB, resultDB) {
    if (errDB);
    console.log(errDB);
  });
});

app.get("/",function(req,res){
connection.query('SELECT * from user LIMIT 2', function(err, rows, fields) {
connection.end();
  if (!err)
    console.log('The solution is: ', rows);
  else
    console.log('Error while performing Query.');
  });
});

console.log(resultDB + "Results log");

db.end(function(errDB) {
  // The connection is terminated now
});

console.log("Closed Connection");

*/

var routes = require('./routes/index');
var users = require('./routes/users');

// Init App
var app = express();

// View Engine
app.set('views', path.join(__dirname, 'views'));
app.engine('handlebars', exphbs({defaultLayout:'layout'}));
app.set('view engine', 'handlebars');

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));

// Passport init
app.use(passport.initialize());
app.use(passport.session());

// Express Validator middleware options from https://github.com/express-validator/express-validator
app.use(expressValidator({  
  errorFormatter: function(param, msg, value) {
      var namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

// Connect Flash
app.use(flash());

// Global Vars
app.use(function (req, res, next) {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error'); 
  res.locals.user = req.user || null;
  next();
});



app.use('/', routes); 
app.use('/users', users);

// Set Port
app.set('port', (process.env.PORT || 3306));

app.listen(app.get('port'), function(){
	console.log('Server started on port '+app.get('port')); 
});