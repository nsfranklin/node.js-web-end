var LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mysql = require('mysql');
var fs = require('fs');
var bcrypt = require('bcryptjs');
var app = express();

//Connect to Mysql db
var db;

function createMySQLConnection(){
	  db = mysql.createConnection({
	  host     : 'cteamteamprojectdatabase.csed5aholavi.eu-west-2.rds.amazonaws.com',
	  user     : 'nodeserver',
	  password : '54Tjltl9LgSWHxrx2AVo',
	  database : 'cTeamTeamProjectDatabase',
	  ssl  : 'Amazon RDS'
	  });
	  
	  return db;
}






//Settings
router.get('/settings', function(req, res){ 
	res.render('settings'); 
});
//Basket
router.get('/basket', function(req, res){ 
	res.render('basket'); 
});
//Image upolads
router.get('/uploads', function(req, res){ 
  res.render('uploads'); 
});
//Register 
router.get('/register', function(req, res){ 
	res.render('register'); 
});
//Login
router.get('/login', function(req, res){ 
	res.render('login'); 
});

router.post('/login', passport.authenticate('local-login', {
  successRedirect: '/',
  failureRedirect: '/login',
  failureFlash: true
 }),
function(req, res){
   if(req.body.remember){
    req.session.cookie.maxAge = 1000 * 60 * 3;
   }else{
    req.session.cookie.expires = false;
   }
   res.redirect('/');
  });

router.post('/register', passport.authenticate('reg', {
	successRedirect:'/login',
	failureRedirect:'/register',
	failureFlash: true
}));

router.post('/cameraSetting', function(req, res){
	db = createMySQLConnection();
	db.connect(function(err) {
	  if (err) {
		console.log('Mysql Connection error:', err);
	  }
	  else{
		console.log('Mysql Connected');
	  }
	  
	});
	app.use(express.urlencoded());
	var selectSQL = "SELECT CameraID FROM CameraDetails WHERE UserID =" + mysql.escape("2"); //User 2 is the test user.
	var cameraID;
	db.query(selectSQL , function(error,results,fields){	
		if(typeof results[0] !== 'undefined'){
			console.log(result[0] + " is defined!");
			cameraID = results[0];
			var sensorSize = req.body.sensorWidth
			console.log("Sensor Size Enter: " + sensorSize);
			var focusLength = req.body.focusLength
			console.log("Focus Length Enter: " + focusLength);
			var sql = "UPDATE CameraDetails SET sensorWidth="+ mysql.escape(sensorSize) +" , focusLength=" + mysql.escape(focusLength) + " WHERE UserID=" + mysql.escape("2");
		}else{
			console.log(cameraID + " is undefined. WOW");
			var sensorSize = req.body.sensorWidth
			console.log("Sensor Size Enter: " + sensorSize);
			if(typeof sensorSize !== Number){
				sensorSize = null;
			}
			console.log("SensorSize int?: " + sensorSize);
			var focusLength = req.body.focusLength
			console.log("Focus Length Enter: " + focusLength);
			if(typeof focusLength !== Number){
				focusLength = null;
			}
			console.log("FocusLength int?: " + focusLength);
			var sql = "INSERT INTO CameraDetails(SensorSize, FocusLength, UserID) VALUES(" + mysql.escape(sensorSize) + "," + mysql.escape(focusLength) + "," + mysql.escape(2) + ")"; 
			console.log(sql);
			db.query(sql)
		}
	})
	
	
	
	
	res.render("settings");
	db.end();
});

/****************************************************************************************/

module.exports = function(passport) {
 passport.serializeUser(function(user, done){
  done(null, user.id);
 });

 passport.deserializeUser(function(id, done){
  connection.query("SELECT * FROM cTeamTeamProjectDatabase.Users WHERE UserID = ? ", [id],
   function(err, rows){
    done(err, rows[0]);
   });
 });

 passport.use(
  'reg',
  new LocalStrategy({
   usernameField : 'username',
   passwordField: 'password',
   passReqToCallback: true
  },
  function(req, username, password, done){
   connection.query("SELECT * FROM cTeamTeamProjectDatabase.Users WHERE UserName = ? ", 
   [username], function(err, rows){
    if(err)
     return done(err);
    if(rows.length){
     return done(null, false, req.flash('signupMessage', 'That is already taken'));
    }else{
     var salt = bcrypt.genSaltSync(10);
	 //var hash = bcrypt.hashSync("B4c0/\/", salt);
     var newUserMysql = {
      UserName: username,
      PassHash: bcrypt.hashSync(password, salt)
     };

     /*
		bcrypt.genSalt(10, function(err, salt) {
    	bcrypt.hash("B4c0/\/", salt, function(err, hash) {
        // Store hash in your password DB.
    		});
		});
     */

     var insertQuery = "INSERT INTO cTeamTeamProjectDatabase.Users (UserName, PassHash) values (?, ?)";

     connection.query(insertQuery, [newUserMysql.username, newUserMysql.password],
      function(err, rows){
       newUserMysql.id = rows.insertId;

       return done(null, newUserMysql);
      });
    }
   });
  })
 );

 passport.use(
  'local-login',
  new LocalStrategy({
   usernameField : 'UserName',
   passwordField: 'PassHash',
   passReqToCallback: true
  },
  function(req, username, password, done){
   connection.query("SELECT PassHash FROM cTeamTeamProjectDatabase.Users WHERE UserName = ? ", [username],
   function(err, rows){
    if(err)
     return done(err);
    if(!rows.length){
     return done(null, false, req.flash('loginMessage', 'No User Found'));
    }
    if(!bcrypt.compareSync(password, hash))
     return done(null, false, req.flash('loginMessage', 'Wrong Password'));

    return done(null, rows[0]);
   });
  })
 );
};

/*
 db.query('SELECT * FROM cTeamTeamProjectDatabase.Users', function (err, result) {
    if (err){
    	console.log(err);
    }
    else{
    	console.log(result[0]);
    }

    });
*/	

/*
router.post('/register', function(req, res){ 
	var name = req.body.name;
	var email = req.body.email;
	var username = req.body.username;
	var password = req.body.password;
	var password2 = req.body.password;



	// Validation
	req.checkBody('name', 'Name is required').notEmpty();
	req.checkBody('email', 'Email is required').notEmpty();
	req.checkBody('email', 'Email is not valid').isEmail();
	req.checkBody('username', 'Username is required').notEmpty();
	req.checkBody('password', 'Password is required').notEmpty();
	req.checkBody('password2', 'Passwords do not match').equals(req.body.password);

	console.log(name)
	var errors = req.validationErrors();

	
	if (errors) {
		console.log('PASSED')
		//re-render the form with error displayed 
		//res.render('register', {
		//	errors: errors
		//});
	}
	else {

		console.log('PASSED2')
		
		var newUser = new User({
			name: name,
			email: email,
			username: username,
			password: password
		});

		User.createUser(newUser, function(err, user){
			
			console.log(user);
			console.log(name);

		});

        req.flash('success_msg','You are now registered and can log in');

        res.redirect('/users/login');
 		




	}

	
});
*/

module.exports = router;