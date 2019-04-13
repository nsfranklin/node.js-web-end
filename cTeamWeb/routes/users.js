var LocalStrategy = require('passport-local').Strategy;
var express = require('express');
var router = express.Router();
var passport = require('passport');
var mysql = require('mysql');
var fs = require('fs');
var bcrypt = require('bcryptjs');
var app = express();
var userID = 37;
var d = new Date();
var session = require('express-session');
//Connect to Mysql db
var db;


// Express Session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true,
}));

function createMySQLConnection(){
	  db = mysql.createConnection({
	  host     : 'cteamteamprojectdatabase.csed5aholavi.eu-west-2.rds.amazonaws.com',
	  user     : 'nodeserver',
	  password : '54Tjltl9LgSWHxrx2AVo',
	  database : 'cTeamTeamProjectDatabase',
	  ssl  : 'Amazon RDS',
	  multipleStatements: true
	  });
	  return db;
}

//Settings
router.get('/settings', function(req, res){ 
	if(req.session.userID){
		resWithSettingDetails(res, req);
	}else{
		res.render('login', { hide: true });
	}
});
var isoCountries = {
    'AF' : 'Afghanistan',
    'AX' : 'Aland Islands',
    'AL' : 'Albania',
    'DZ' : 'Algeria',
    'AS' : 'American Samoa',
    'AD' : 'Andorra',
    'AO' : 'Angola',
    'AI' : 'Anguilla',
    'AQ' : 'Antarctica',
    'AG' : 'Antigua And Barbuda',
    'AR' : 'Argentina',
    'AM' : 'Armenia',
    'AW' : 'Aruba',
    'AU' : 'Australia',
    'AT' : 'Austria',
    'AZ' : 'Azerbaijan',
    'BS' : 'Bahamas',
    'BH' : 'Bahrain',
    'BD' : 'Bangladesh',
    'BB' : 'Barbados',
    'BY' : 'Belarus',
    'BE' : 'Belgium',
    'BZ' : 'Belize',
    'BJ' : 'Benin',
    'BM' : 'Bermuda',
    'BT' : 'Bhutan',
    'BO' : 'Bolivia',
    'BA' : 'Bosnia And Herzegovina',
    'BW' : 'Botswana',
    'BV' : 'Bouvet Island',
    'BR' : 'Brazil',
    'IO' : 'British Indian Ocean Territory',
    'BN' : 'Brunei Darussalam',
    'BG' : 'Bulgaria',
    'BF' : 'Burkina Faso',
    'BI' : 'Burundi',
    'KH' : 'Cambodia',
    'CM' : 'Cameroon',
    'CA' : 'Canada',
    'CV' : 'Cape Verde',
    'KY' : 'Cayman Islands',
    'CF' : 'Central African Republic',
    'TD' : 'Chad',
    'CL' : 'Chile',
    'CN' : 'China',
    'CX' : 'Christmas Island',
    'CC' : 'Cocos (Keeling) Islands',
    'CO' : 'Colombia',
    'KM' : 'Comoros',
    'CG' : 'Congo',
    'CD' : 'Congo, Democratic Republic',
    'CK' : 'Cook Islands',
    'CR' : 'Costa Rica',
    'CI' : 'Cote D\'Ivoire',
    'HR' : 'Croatia',
    'CU' : 'Cuba',
    'CY' : 'Cyprus',
    'CZ' : 'Czech Republic',
    'DK' : 'Denmark',
    'DJ' : 'Djibouti',
    'DM' : 'Dominica',
    'DO' : 'Dominican Republic',
    'EC' : 'Ecuador',
    'EG' : 'Egypt',
    'SV' : 'El Salvador',
    'GQ' : 'Equatorial Guinea',
    'ER' : 'Eritrea',
    'EE' : 'Estonia',
    'ET' : 'Ethiopia',
    'FK' : 'Falkland Islands (Malvinas)',
    'FO' : 'Faroe Islands',
    'FJ' : 'Fiji',
    'FI' : 'Finland',
    'FR' : 'France',
    'GF' : 'French Guiana',
    'PF' : 'French Polynesia',
    'TF' : 'French Southern Territories',
    'GA' : 'Gabon',
    'GM' : 'Gambia',
    'GE' : 'Georgia',
    'DE' : 'Germany',
    'GH' : 'Ghana',
    'GI' : 'Gibraltar',
    'GR' : 'Greece',
    'GL' : 'Greenland',
    'GD' : 'Grenada',
    'GP' : 'Guadeloupe',
    'GU' : 'Guam',
    'GT' : 'Guatemala',
    'GG' : 'Guernsey',
    'GN' : 'Guinea',
    'GW' : 'Guinea-Bissau',
    'GY' : 'Guyana',
    'HT' : 'Haiti',
    'HM' : 'Heard Island & Mcdonald Islands',
    'VA' : 'Holy See (Vatican City State)',
    'HN' : 'Honduras',
    'HK' : 'Hong Kong',
    'HU' : 'Hungary',
    'IS' : 'Iceland',
    'IN' : 'India',
    'ID' : 'Indonesia',
    'IR' : 'Iran, Islamic Republic Of',
    'IQ' : 'Iraq',
    'IE' : 'Ireland',
    'IM' : 'Isle Of Man',
    'IL' : 'Israel',
    'IT' : 'Italy',
    'JM' : 'Jamaica',
    'JP' : 'Japan',
    'JE' : 'Jersey',
    'JO' : 'Jordan',
    'KZ' : 'Kazakhstan',
    'KE' : 'Kenya',
    'KI' : 'Kiribati',
    'KR' : 'Korea',
    'KW' : 'Kuwait',
    'KG' : 'Kyrgyzstan',
    'LA' : 'Lao People\'s Democratic Republic',
    'LV' : 'Latvia',
    'LB' : 'Lebanon',
    'LS' : 'Lesotho',
    'LR' : 'Liberia',
    'LY' : 'Libyan Arab Jamahiriya',
    'LI' : 'Liechtenstein',
    'LT' : 'Lithuania',
    'LU' : 'Luxembourg',
    'MO' : 'Macao',
    'MK' : 'Macedonia',
    'MG' : 'Madagascar',
    'MW' : 'Malawi',
    'MY' : 'Malaysia',
    'MV' : 'Maldives',
    'ML' : 'Mali',
    'MT' : 'Malta',
    'MH' : 'Marshall Islands',
    'MQ' : 'Martinique',
    'MR' : 'Mauritania',
    'MU' : 'Mauritius',
    'YT' : 'Mayotte',
    'MX' : 'Mexico',
    'FM' : 'Micronesia, Federated States Of',
    'MD' : 'Moldova',
    'MC' : 'Monaco',
    'MN' : 'Mongolia',
    'ME' : 'Montenegro',
    'MS' : 'Montserrat',
    'MA' : 'Morocco',
    'MZ' : 'Mozambique',
    'MM' : 'Myanmar',
    'NA' : 'Namibia',
    'NR' : 'Nauru',
    'NP' : 'Nepal',
    'NL' : 'Netherlands',
    'AN' : 'Netherlands Antilles',
    'NC' : 'New Caledonia',
    'NZ' : 'New Zealand',
    'NI' : 'Nicaragua',
    'NE' : 'Niger',
    'NG' : 'Nigeria',
    'NU' : 'Niue',
    'NF' : 'Norfolk Island',
    'MP' : 'Northern Mariana Islands',
    'NO' : 'Norway',
    'OM' : 'Oman',
    'PK' : 'Pakistan',
    'PW' : 'Palau',
    'PS' : 'Palestinian Territory, Occupied',
    'PA' : 'Panama',
    'PG' : 'Papua New Guinea',
    'PY' : 'Paraguay',
    'PE' : 'Peru',
    'PH' : 'Philippines',
    'PN' : 'Pitcairn',
    'PL' : 'Poland',
    'PT' : 'Portugal',
    'PR' : 'Puerto Rico',
    'QA' : 'Qatar',
    'RE' : 'Reunion',
    'RO' : 'Romania',
    'RU' : 'Russian Federation',
    'RW' : 'Rwanda',
    'BL' : 'Saint Barthelemy',
    'SH' : 'Saint Helena',
    'KN' : 'Saint Kitts And Nevis',
    'LC' : 'Saint Lucia',
    'MF' : 'Saint Martin',
    'PM' : 'Saint Pierre And Miquelon',
    'VC' : 'Saint Vincent And Grenadines',
    'WS' : 'Samoa',
    'SM' : 'San Marino',
    'ST' : 'Sao Tome And Principe',
    'SA' : 'Saudi Arabia',
    'SN' : 'Senegal',
    'RS' : 'Serbia',
    'SC' : 'Seychelles',
    'SL' : 'Sierra Leone',
    'SG' : 'Singapore',
    'SK' : 'Slovakia',
    'SI' : 'Slovenia',
    'SB' : 'Solomon Islands',
    'SO' : 'Somalia',
    'ZA' : 'South Africa',
    'GS' : 'South Georgia And Sandwich Isl.',
    'ES' : 'Spain',
    'LK' : 'Sri Lanka',
    'SD' : 'Sudan',
    'SR' : 'Suriname',
    'SJ' : 'Svalbard And Jan Mayen',
    'SZ' : 'Swaziland',
    'SE' : 'Sweden',
    'CH' : 'Switzerland',
    'SY' : 'Syrian Arab Republic',
    'TW' : 'Taiwan',
    'TJ' : 'Tajikistan',
    'TZ' : 'Tanzania',
    'TH' : 'Thailand',
    'TL' : 'Timor-Leste',
    'TG' : 'Togo',
    'TK' : 'Tokelau',
    'TO' : 'Tonga',
    'TT' : 'Trinidad And Tobago',
    'TN' : 'Tunisia',
    'TR' : 'Turkey',
    'TM' : 'Turkmenistan',
    'TC' : 'Turks And Caicos Islands',
    'TV' : 'Tuvalu',
    'UG' : 'Uganda',
    'UA' : 'Ukraine',
    'AE' : 'United Arab Emirates',
    'GB' : 'United Kingdom',
    'US' : 'United States',
    'UM' : 'United States Outlying Islands',
    'UY' : 'Uruguay',
    'UZ' : 'Uzbekistan',
    'VU' : 'Vanuatu',
    'VE' : 'Venezuela',
    'VN' : 'Viet Nam',
    'VG' : 'Virgin Islands, British',
    'VI' : 'Virgin Islands, U.S.',
    'WF' : 'Wallis And Futuna',
    'EH' : 'Western Sahara',
    'YE' : 'Yemen',
    'ZM' : 'Zambia',
    'ZW' : 'Zimbabwe'
};
function getCountryName(countryCode) {
    if (isoCountries.hasOwnProperty(countryCode)) {
        return isoCountries[countryCode];
    } else {
        return countryCode;
    }
}
function resWithSettingDetails(res, req){
	db = createMySQLConnection();
	db.connect(function(err) {
	  if (err) {
		console.log('Mysql Connection error:', err);
	  }
	  else{
		console.log('Mysql Connected');
	  }
	});
	var sql1 = "SELECT Email FROM Users WHERE UserID =" + mysql.escape(req.session.userID) + ";";
	var sql2 = " SELECT SensorSize, FocusLength FROM CameraDetails WHERE UserID=" + mysql.escape(req.session.userID) + " LIMIT 1;";
	var sql3 = " SELECT FirstName, LastName, AddressNum, AddressLine, City, PostalCode, Country, AddressType FROM Address WHERE UserID=" + mysql.escape(req.session.userID) ;
	var sql = sql1.toString() + sql2.toString() + sql3.toString();
	console.log(sql);
	db.query(sql, function(err, results, fields){
		var Users = results[0];
		var CameraDetails = results[1];
		var Address = results[2];
		var email = "";
		if(Users[0] !== undefined){
			email = Users[0].Email;
		}
		var sensorWidth1 = "";
		var focusLength1 = "";
		if(CameraDetails[0] !== undefined){
			sensorWidth1 = CameraDetails[0].SensorSize;
			focusLength1 = CameraDetails[0].FocusLength;
		}
		var BFirstName = "";
		var BSurname = "";
		var baddressnumber = "";
		var baddressname = "";
		var bpostcode = "";
		var bcity = "";
		var bccode = ""
		var bcountry = "";
		var DFirstName = "";
		var DSurname = "";
		var daddressnumber = "";
		var daddressname = "";
		var dpostcode = "";
		var dcity = "";
		var dccode = "";
		var dcountry = "";
		var show = false;
		console.log(results);
		console.log(CameraDetails[0]);
		console.log(Address.length);
		var numberOfAddresses = Address.length;
		if(numberOfAddresses >= 2){
			if(Address[0].AddressType == 2){
				BFirstName = Address[0].FirstName;
				BSurname = Address[0].LastName;
				baddressnumber = Address[0].AddressNum;
				baddressname = Address[0].AddressLine;
				bpostcode = Address[0].PostalCode;
				bcity = Address[0].City;
				bccode = Address[0].Country;
				bcountry = getCountryName(bccode);
			}else if(Address[0].AddressType == 3){
				DFirstName = Address[0].FirstName;
				DSurname = Address[0].LastName;
				daddressnumber = Address[0].AddressNum;
				daddressname = Address[0].AddressLine;
				dpostcode = Address[0].PostalCode;
				dcity = Address[0].City;
				dccode = Address[0].Country;
				dcountry = getCountryName(dccode);
			}
			if(Address[1].AddressType == 2){
				BFirstName = Address[1].FirstName;
				BSurname = Address[1].LastName;
				baddressnumber = Address[1].AddressNum;
				baddressname = Address[1].AddressLine;
				bpostcode = Address[1].PostalCode;
				bcity = Address[1].City;
				bccode = Address[1].Country;
				bcountry = getCountryName(bccode);
			}else if(Address[1].AddressType == 3){
				DFirstName = Address[1].FirstName;
				DSurname = Address[1].LastName;
				daddressnumber = Address[1].AddressNum;
				daddressname = Address[1].AddressLine;
				dpostcode = Address[1].PostalCode;
				dcity = Address[1].City;
				dccode = Address[1].Country;
				dcountry = getCountryName(dccode);
			}
		}else if(numberOfAddresses == 1){
			if(Address[0].AddressType == 1){
				BFirstName = Address[0].FirstName;
				BSurname = Address[0].LastName;
				baddressnumber = Address[0].AddressNum;
				baddressname = Address[0].AddressLine;
				bpostcode = Address[0].PostalCode;
				bcity = Address[0].City;
				bccode = Address[0].Country;
				bcountry = getCountryName(bccode);
				DFirstName = Address[0].FirstName;
				DSurname = Address[0].LastName;
				daddressnumber = Address[0].AddressNum;
				daddressname = Address[0].AddressLine;
				dpostcode = Address[0].PostalCode;
				dcity = Address[0].City;
				dccode = Address[0].Country;
				dcountry = getCountryName(dccode);
				show = true;
			}else if(Address[0].AddressType == 2){
				BFirstName = Address[0].FirstName;
				BSurname = Address[0].LastName;
				baddressnumber = Address[0].AddressNum;
				baddressname = Address[0].AddressLine;
				bpostcode = Address[0].PostalCode;
				bcity = Address[0].City;
				bccode = Address[0].Country;
				bcountry = getCountryName(bccode);
			}else if(Address[0].AddressType == 3){
				DFirstName = Address[0].FirstName;
				DSurname = Address[0].LastName;
				daddressnumber = Address[0].AddressNum;
				daddressname = Address[0].AddressLine;
				dpostcode = Address[0].PostalCode;
				dcity = Address[0].City;
				dccode = Address[0].Country;
				dcountry = getCountryName(dccode);
			}
		} //if size is 0 then you don't need to alter any values.
		
		res.render('settings', {
			email: email
			,sensorWidth1: sensorWidth1
			,focusLength1: focusLength1
			,BFirstName: BFirstName
			,BSurname: BSurname
			,baddressnumber: baddressnumber
			,baddressname: baddressname
			,bpostcode: bpostcode
			,bcity: bcity
			,bccode: bccode
			,bcountry: bcountry
			,show: show
			,DFirstName: DFirstName
			,DSurname: DSurname
			,daddressnumber: daddressnumber
			,daddressname: daddressname
			,dpostcode: dpostcode
			,dcity: dcity
			,dccode: dccode
			,dcountry: dcountry
		});
	})
}	
//Basket
router.get('/basket', function(req, res){ 
	if(req.session.userID){
		console.log("basket of user: " + req.session.userID);
		resBasket(res, req); 
	}else{
		res.render('login', { hide: true }); 
	}
});
//Image upolads
router.get('/uploads', function(req, res){ 
	if(req.session.userID){
		res.render('uploads');
	}else{
		res.render('login', { hide: true });
	}
});
//Register 
router.get('/register', function(req, res){ 
	res.render('register', {hide: true} );
});
//Login
router.get('/login', function(req, res){
	res.render('login', {
		hide: true
	}); 
});
router.get('/management', function(req, res){
	if(req.session.userID){
		resManagement(res,req);
	}else{
		res.render('login', { hide: true });
	}
});
router.get('/listings', function(req, res){
	if(req.session.userID){
		resListings(res,req);
	}else{
		res.render('login', { hide: true });
	}
});
router.get('/product', function(req, res){
	if(req.session.userID){
		res.render('product');
	}else{
		res.render('login', { hide: true });
	}
});
router.get('/order', function(req, res){
	if(req.session.userID){
		res.render('order');
	}else{
		res.render('login', { hide: true });
	}
});
router.post('/login', function(req, res){
	app.use(express.urlencoded());
	username = req.body.username;
	req.session.user;
	findUser(username, function(result){
			if(result){
				req.session.userID = result;
				resListings(res, req);
			}else{
				res.render('login', {
					error: 'Unknown Username or Password'
				});
			}
	});
});
router.post('/register', function(req, res){
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
	
	var firstName = req.body.firstname;
	var surname = req.body.surname;
	var username = req.body.username;
	var email = req.body.email;
	var pass1 = req.body.password1;
	var pass2 = req.body.password2
	
	
	if(checkRegisterValues(firstName,surname,username,email,pass1,pass2)){
		const regex = /\S+@\S+/
		var usableEmail = false;
		if(email !== undefined){
		usableEmail = regex.test(String(email).toLowerCase())
		console.log("Valid Email Result: " + usableEmail);
		}
		var sql1 = "SELECT UserID FROM Users WHERE UserName =" + mysql.escape(username) + ";";
		var sql2 = " SELECT UserID FROM Users WHERE Email =" + mysql.escape(email) + ";";
		var sql = sql1 + sql2;
		if(pass1 === pass2){
			console.log(sql);
			db.query(sql, function(error, results, fields){
				console.log(results);
				if(results[0].length === 0 && results[1].length === 0){
					if(usableEmail){
						var createUserSQL = "INSERT INTO Users (UserName, SellerRating, FirstName, Surname, Email) Values(" + mysql.escape(username) + ",0," + mysql.escape(firstName) + "," + mysql.escape(surname) + "," + mysql.escape(email) + ");";
						db.query(createUserSQL, function(err){
							res.render('login', { error: "Account Created" });
						});
					}else{
						res.render('register', {
							error: "Email Not Valid",
							firstname: firstName,
							surname: surname,
							username: username
						});
					}
				}else{
					if(results[0].length !== 0 && results[1].length !== 0){
					res.render('register', {
						error: "Username and email in use",
						firstname: firstName,
						surname: surname
					});
					}else if(results[0].length !== 0){
					res.render('register', {
						error: "Username in use",
						firstname: firstName,
						surname: surname,
						email: email
					});
					}else{
					res.render('register', {
						error: "Email in use",
						firstname: firstName,
						surname: surname,
						uername: username
					});
					}
				}
			});
		}else{
			res.render('register', {
				error: "Passwords not the same",
				firstname: firstName,
				surname: surname,
				email: email,
				username: username
			});
		}
	}
});
router.post('/email', function(req, res){
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
	const regex = /\S+@\S+/
	var usableEmail = false;
	var email = req.body.email;
	if(email !== undefined){
		usableEmail = regex.test(String(email).toLowerCase())
		console.log("Valid Email Result: " + usableEmail);
	}
	if(usableEmail){
		var SQL = "UPDATE Users Set Email="+ mysql.escape(email) + " WHERE UserID =" + mysql.escape(req.session.userID);
		db.query(SQL , function(error,results,fields){	
			resWithSettingDetails(res);
			db.end();
		})
	}else{
		resWithSettingDetails(res);
	}
});
router.post('/password', function(req, res){
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
	var selectSQL = "SELECT CameraID FROM CameraDetails WHERE UserID =" + mysql.escape(req.session.userID);
	var cameraID;
	db.query(selectSQL , function(error,results,fields){	
		resWithSettingDetails(res);
		db.end();
	})
});
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
	var selectSQL = "SELECT CameraID FROM CameraDetails WHERE UserID =" + mysql.escape(req.session.userID);
	var cameraID;
	db.query(selectSQL , function(error,results,fields){	
		if(typeof results[0] !== 'undefined'){
			console.log(results[0] + " is defined!");
			cameraID = results[0];
			var sensorSize = parseFloat(req.body.sensorWidth)
			console.log("Sensor Size Enter: " + sensorSize);
			if(isNaN(sensorSize)){
				sensorSize = null;
			}
			console.log("SensorSize int?: " + sensorSize);
			var focusLength = parseFloat(req.body.focusLength)
			console.log("Focus Length Enter: " + focusLength);
			if(isNaN(focusLength)){
				focusLength = null;
			}
			console.log("FocusLength int?: " + focusLength);
			var sql = "UPDATE CameraDetails SET SensorSize="+ mysql.escape(sensorSize) +" , FocusLength=" + mysql.escape(focusLength) + " WHERE UserID=" + mysql.escape(req.session.userID);
			console.log(sql);
			db.query(sql);
		}else{
			console.log(cameraID + " is undefined. WOW");
			var sensorSize = parseFloat(req.body.sensorWidth)
			console.log("Sensor Size Enter: " + sensorSize);
			if(sensorSize === NaN){
				sensorSize = null;
			}
			console.log("SensorSize int?: " + sensorSize);
			var focusLength = parseFloat(req.body.focusLength)
			console.log("Focus Length Enter: " + focusLength);
			if(focusLength === NaN){
				focusLength = null;
			}
			console.log("FocusLength int?: " + focusLength);
			var sql = "INSERT INTO CameraDetails(SensorSize, FocusLength, UserID) VALUES(" + mysql.escape(sensorSize) + "," + mysql.escape(focusLength) + "," + mysql.escape(req.session.userID) + ")"; 
			console.log(sql);
			db.query(sql)
		}
		resWithSettingDetails(res, req);
		db.end();
	})
});
router.post('/billing', function(req, res){
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
	var selectSQL = "SELECT CameraID FROM CameraDetails WHERE UserID =" + mysql.escape(req.session.userID); 
	var cameraID;
	db.query(selectSQL , function(error,results,fields){	

		resWithSettingDetails(res);
		db.end();
	})
});
router.post('/delivery', function(req, res){
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
	var selectSQL = "SELECT CameraID FROM CameraDetails WHERE UserID =" + mysql.escape(req.session.userID); 
	var cameraID;
	db.query(selectSQL , function(error,results,fields){	

		resWithSettingDetails(res);
		db.end();
	})
});
router.post('/removeItem', function(req,res){
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
	var ProductID = req.body.ProductID;
	var sql = "DELETE FROM Basket WHERE UserID=" + mysql.escape(req.session.userID) + " AND " + "ProductID=" + mysql.escape(ProductID);
	console.log(sql);
	db.query(sql, function(error, results, fields){
	console.log(error);
	resBasket(res, req);
	});
});
router.post('/checkout', function(req,res){
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
	var ProductID = req.body.ProductID;
	//var sql = "UPDATE Product SET State=" + mysql.escape("ordered") + " WHERE Product.ListingID = (SELECT Product.ListingID From Basket, Product, Image Where Basket.UserID =" + mysql.escape(userID) + " AND Basket.ProductID = Product.ListingID);" ;
	var sqlDeleteStatement = "DELETE FROM Basket WHERE Basket.UserID =" + mysql.escape(req.session.userID);
	db.query(sql, function(error, results, fields){
		basketToOrders();
		sqlNoReturnQuery(sqlDeleteStatement);
		resManagement(res, req);
	});
});
router.post('/newListing', function(req, res){
	db = createMySQLConnection();
	db.connect(function(err) {
	  if (err) {
		console.log('Mysql Connection error:', err);
	  }else{
		console.log('Mysql Connected');
	  }
	});
	app.use(express.urlencoded());
	var productName = req.body.pname;
	var price = req.body.price
	var productDescription = req.body.pdescription
	var condition = req.body.condition
	var brand = req.body.brand
	var type = req.body.type
	var size = req.body.size
	var colour = req.body.colour
	var material = req.body.material
	var sex = req.body.sex
	var allNonNull = checkforEmpty(res,productName,price,productDescription,condition,brand,type,size,colour,material,sex); 
	
	console.log(allNonNull);
	
	if(allNonNull){
		console.log("All Null");
		var pending = "0";
		var state = "pending";
		var CameraID = 1;
		var DateCreated = new Date().toISOString().slice(0, 19).replace('T', ' ');;
		var CoverImageID = getRndInteger(1,100);
		var colourName = "tempColour";//findColour();
		var sql1 = "INSERT INTO Product(SellerID,Price,`Product`.`Name`,Description,DateCreated,Pending,`Product`.`Condition`,Colour,Brand,`Product`.`Type`,Size,Material,Sex,State,CameraID,CoverImageID) VALUES(" + req.session.userID + "," + price + ",\"" + productName + "\",\"" + productDescription + "\",\"" + DateCreated + "\"," + pending + ",\"" + condition + "\",\"" + colourName + "\",\"" + brand + "\",\"" + type + "\"," + size + ",\"" + material + "\",\"" + sex + "\",\"" + state + "\"," + CameraID + ",\"" + CoverImageID + "\");";
		var sql2 = "";
		var sql = sql1 + sql2;
		db.query(sql, function(error, results, fields){console.log(error)});
		res.render('uploads');	
	}else{
		resWithUploadDetails(res, productName,price,productDescription,condition,brand,type,size,colour,material,sex);
	}
	
	/*
	console.log(productName);
	console.log(price);
	console.log(productDescription);
	console.log(condition);
	console.log(brand);
	console.log(type);
	console.log(size);
	console.log(colour);
	console.log(material);
	console.log(sex);
	*/
	//var selectSQL = "INSERT 
});
router.post('/updateListing', function(req,res){
	app.use(express.urlencoded());
	var listingID = req.body.ProductID;
	db = createMySQLConnection();
	db.connect(function(err) {
	  if (err) {
		console.log('Mysql Connection error:', err);
	  }
	  else{
		console.log('Mysql Connected');
	  }
	});
	//var sql = "DELETE FROM Product WHERE ListingID =" + mysql.escape(listingID);
	//console.log(sql);
	//db.query(sql, function(error, results, fields){
	//	console.log(error);
	//	resListings(res, userID);
	//})
	console.log("Delecting Items Currently Disabled");
	resListings(res, req);
});
router.post('/orderStatusUpdate', function(req,res){
	app.use(express.urlencoded());
	var listingID = req.body.ProductID;
	db = createMySQLConnection();
	db.connect(function(err) {
	  if (err) {
		console.log('Mysql Connection error:', err);
	  }
	  else{
		console.log('Mysql Connected');
	  }
	});
	var listingID = req.body.ProductID;
	var Status = req.body.Status;
	var sql = "-1";
	
	if(Status = "paid"){
		sql = "UPDATE cTeamTeamProjectDatabase.Order Set isOpen = 1 , OrderState =" + mysql.escape("dispatched") + " WHERE ProductID =" + mysql.escape(listingID);
	}else if(Status = "dispatched"){
		sql = "UPDATE cTeamTeamProjectDatabase.Order Set isOpen = 1 , OrderState =" + mysql.escape("arrived") + " WHERE ProductID =" + mysql.escape(listingID);
	}else if(Status = "arrived"){
		sql = "UPDATE cTeamTeamProjectDatabase.Order Set isOpen = 0 , OrderState =" + mysql.escape("closed") + " WHERE ProductID =" + mysql.escape(listingID);
	}
	
	if(sql == "-1"){
		resManagement(res, req);
	}else{
		console.log("updated");
		db.query(sql, function(error, results, fields){
			console.log(sql);
			console.log(error);
			resManagement(res, req);
		});
	}
	console.log("Updated Order");
});
router.post('/salesStatusUpdate', function(req,res){
	app.use(express.urlencoded());
	var listingID = req.body.ProductID;
	db = createMySQLConnection();
	db.connect(function(err) {
	  if (err) {
		console.log('Mysql Connection error:', err);
	  }
	  else{
		console.log('Mysql Connected');
	  }
	});
	var listingID = req.body.ProductID;
	var Status = req.body.Status;
	var sql = "-1";
	
	if(Status = "paid"){
		sql = "UPDATE cTeamTeamProjectDatabase.Order Set isOpen = 1 , OrderState =" + mysql.escape("dispatched") + " WHERE ProductID =" + mysql.escape(listingID);
	}else if(Status = "dispatched"){
		sql = "UPDATE cTeamTeamProjectDatabase.Order Set isOpen = 1 , OrderState =" + mysql.escape("arrived") + " WHERE ProductID =" + mysql.escape(listingID);
	}else if(Status = "arrived"){
		sql = "UPDATE cTeamTeamProjectDatabase.Order Set isOpen = 0 , OrderState =" + mysql.escape("closed") + " WHERE ProductID =" + mysql.escape(listingID);
	}
	
	if(sql == "-1"){
		resManagement(res, req);
	}else{
		console.log("updated");
		db.query(sql, function(error, results, fields){
			console.log(sql);
			console.log(error);
			resManagement(res, req);
		});
	}
	console.log("Updated Listing");
});
router.post('/openDetails', function(req, res){
	res.render('viewListing');
});
router.post('/viewSale', function(req, res){
	res.render('viewSale');
});
router.post('/viewOrder', function(req, res){
	res.render('viewOrder');
});
router.post('/cameraCalibration', function(req, res){
	db = createMySQLConnection();
	db.connect(function(err) {
	  if (err) {
		console.log('Mysql Connection error:', err);
	  }else{
		console.log('Mysql Connected');
	  }
	});
	app.use(express.urlencoded());
	var fileArray = req.body.file;
	console.log(fileArray);
	console.log(typeof fileArray);
	if(!Array.isArray(fileArray) || fileArray.length < 8 || fileArray.length > 10){
		res.render('settings', {error: "8 - 10 calibration images needed. see guide"});
	}
	for(var i; i < fileArray.length ; i++){
		
	}
	
});
function basketToOrders(req){
	db = createMySQLConnection();
	db.connect(function(err) {
	  if (err) {
		console.log('Mysql Connection error:', err);
	  }
	  else{
		console.log('Mysql Connected');
	  }
	});
	var sql = "SELECT COUNT(UserID) FROM Basket WHERE Basket.UserID=" + mysql.escape(req.session.userID);
	console.log(sql);
	db.query(sql, function(error, results, fields){
		console.log(error);
		console.log(results);
		//var sql = "INSERT INTO Order(PurchaserID, SellerID, ProductID, OrderState, isOpen) Values(" mysql.escape(userID) +","+ mysql.escape() +","+ mysql.escape() +","+ mysql.escape() +","+ mysql.escape(1) + ");"
		for(var i = 0 ; i < results[0].COUNT(UserID); i++){
			sqlNoReturnQuery();
		}
	});
}
function sqlNoReturnQuery(sql){
	db = createMySQLConnection();
	db.connect(function(err) {
	  if (err) {
		console.log('Mysql Connection error:', err);
	  }
	  else{
		console.log('Mysql Connected');
	  }
	});
	db.query(sql, function(error, results, fields){
		console.log(error);
	});
}
function resWithUploadDetails(res,productName,price,productDescription,condition,brand,type,size,colour,material,sex){
	res.render('uploads', {
	productName: productName
	,price: price
	,productDescription: productDescription
	,condition: condition
	,brand: brand
	,type: type
	,size: size
	,colour: colour
	,material: material
	,sex: sex
	});
}
function resBasket(res, req){
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
	var sql = "Select Name, Price, ImageBlob, ImageID, Product.ListingID  From Basket, Product, Image Where Basket.UserID =" +mysql.escape(req.session.userID) + " AND Basket.ProductID = Product.ListingID AND Product.CoverImageID = Image.ImageID"
	var results;
	db.query(sql, function(error, results, fields){
		//console.log(sql);
		//console.log(results);
		//console.log(error);
		var imageBuffer;
		var imageName = 'public/Image/';
		var imageReturnedName = '/Image/';
		var imagePath = imageName;
		var imageReturnedPath = imageReturnedName;
		var total = 0;
		for(var i = 0 ; i < results.length ; i++){
			total = total + results[i].Price;
			imageBuffer = results[i].ImageBlob;
			imagePath = imageName + results[i].ImageID + ".png";
			imageReturnedPath = imageReturnedName + results[i].ImageID + ".png";
			if(!fs.existsSync(imagePath)){
				fs.createWriteStream(imagePath).write(imageBuffer);
			}
			results[i].ImageBlob = imageReturnedPath;
			//console.log(results);
		}
		res.render('basket', {
			basketItem: results,
			subtotal: total.toFixed(2)
		});
	})
}
function resManagement(res, req){
	db = createMySQLConnection();
	db.connect(function(err) {
	  if (err) {
		console.log('Mysql Connection error:', err);
	  }
	  else{
		console.log('Mysql Connected');
	  }
	});
	var sql1 = "SELECT Product.ListingID, Product.Name, Product.CoverImageID, Price, OrderState FROM `cTeamTeamProjectDatabase`.`Order`, Product WHERE Product.ListingID = Order.ProductID AND PurchaserID =" + mysql.escape(req.session.userID) + ";";  //selects users orders
	var sql2 = "SELECT Product.ListingID, Product.Name, Product.CoverImageID, Price, OrderState FROM `cTeamTeamProjectDatabase`.`Order`, Product WHERE Product.ListingID = Order.ProductID AND Order.SellerID =" + mysql.escape(req.session.userID) + ";"; //selects users sales
	var sql = sql1.toString() + sql2.toString();
	console.log(sql);
	db.query(sql, function(err, results, fields){
		for(var i = 0 ; i < results[0].length ; i++){
			if(!fs.existsSync('public/Image/' + results[0][i].CoverImageID + ".png")){
				imageEncode(results[0][i].CoverImageID);
				console.log("unfound image");
			}
			if (results[0][i].OrderState === 'undefined'){
				results[0][i].OrderState = "paid";
			}
			if(results[0][i].OrderState == "paid"){
				results[0][i].ButtonValue = "value=\"Waiting For Dispatched\" disabled";
			}
			if(results[0][i].OrderState == "arrived"){
				results[0][i].ButtonValue = "value=\"Close Order\"";
			}
			if(results[0][i].OrderState == "dispatched"){
				results[0][i].ButtonValue = "value=\"Mark as Arrived\"";
			}
			
		}
		for(var j = 0 ; j < results[1].length ; j++){
			if(!fs.existsSync('public/Image/' + results[1][j].CoverImageID + ".png")){
				imageEncode(results[1][j].CoverImageID);
				console.log("unfound image");
			}
			if (results[1][j].OrderState === 'undefined'){
				results[1][j].OrderState = "paid";
			}
			if(results[1][j].OrderState == "paid"){
				results[1][j].ButtonValue = "value=\"Mark As Dispatched\"";
			}
			if(results[1][j].OrderState == "arrived"){
				results[1][j].ButtonValue = "value=\"Close Order\"";
			}
			if(results[1][j].OrderState == "dispatched"){
				results[1][j].ButtonValue = "value=\"Waiting On Buy Response\" disabled";
			}
		}
		console.log(err);
		console.log(results);
		res.render('management',{
			Orders: results[0],
			Sales: results[1]
		});
	});
}
function resListings(res,req){
	db = createMySQLConnection();
	db.connect(function(err) {
	  if (err) {
		console.log('Mysql Connection error:', err);
	  }
	  else{
		//console.log('Mysql Connected');
	  }
	});
	var sql = "SELECT Product.ListingID, Product.Name, Product.CoverImageID, Price, State FROM Product WHERE SellerID=" + mysql.escape(req.session.use) + ";";  //selects users orders
	//console.log(sql);
	db.query(sql, function(err, results, fields){
		for(var i = 0 ; i < results.length ; i++){
			if(results[i].State == "available" || results[i].State == "failed" || results[i].State == "pending"){
				results[i].ButtonValue =  "Delete Listing";
			}
			if(results[i].State == 'arrived'){
				results[i].ButtonValue = "Close Listing ";
			}
		}
		//console.log(err);
		//console.log(results);
		res.render('listings',{
			listings: results
		});
	});
}
async function encodeImageFromDatabase(CoverImageID){
	return new Promise((resolve, reject) => {
		console.log("Encoding Images");
		db = createMySQLConnection();
		db.connect(function(err) {
		  if (err) {
			console.log('Mysql Connection error:', err);
		  }
		  else{
			console.log('Mysql Connected');
		  }
		});
		var sql = "Select ImageBlob From Image Where ImageID =" + mysql.escape(CoverImageID);
		db.query(sql, function(error, results, fields){
			console.log(sql);
			console.log(results);
			console.log(error);
			var imageBuffer;
			var imageName = 'public/Image/';
			var imagePath = imageName;
			for(var i = 0 ; i < results.length ; i++){
				imageBuffer = results[i].ImageBlob;
				imagePath = imageName + CoverImageID + ".png";
				if(!fs.existsSync(imagePath)){
					fs.createWriteStream(imagePath).write(imageBuffer);
				}
				console.log(results);
			}
		});
		console.log("about to resolve");
		resolve('resolving');
	});
}
async function imageEncode(CoverImageID){
	var a = await encodeImageFromDatabase(CoverImageID)
}
function checkforEmpty(res,a,b,c,d,e,f,g,h,i,j){
	if(a==""|| null){
		return false;
	}
	if(b==""|| null){
		return false;
	}	
	if(c==""|| null){
		return false;
	}	
	if(d==""|| null){
		return false;		
	}
	if(e==""|| null){
		return false;	
	}
	if(f==""|| null){
		return false;	
	}
	if(g==""|| null){
		return false;	
	}
	if(h==""|| null){
		return false;
	}
	if(i==""|| null){
		return false;
	}
	if(j==""|| null){
		return false;
	}
	return true;
}
function getRndInteger(min, max) {
  return Math.floor(Math.random() * (max - min) ) + min;
}
function getCurrentDate(){
	var result;
	var month = d.getMonth() + 1;
	var day = d.getDate();
	if(month < 10){
		month = "0" + month.toString();
		console.log(month);
	}
	if(day <10){
		day = "0" + day.toString();
		console.log(day);
	}
	result = d.getFullYear() + "-" + month +"-"+day+" "+d.getHours()+":"+d.getMinutes()+":"+d.getSeconds();
	console.log(result);
	return result;
}
function findUser(username, callback){
	db = createMySQLConnection();
	db.connect(function(err) {
	  if (err) {
		console.log('Mysql Connection error:', err);
	  }
	  else{
		//console.log('Mysql Connected');
	  }
	});
	var sql = "SELECT UserID FROM Users WHERE username = " + mysql.escape(username) + " LIMIT 1";
	db.query(sql, function(error, results, fields){
		if(results.length > 0){
			return callback(results[0].UserID);
		}
		else{
			return callback();
		}
	});
}
function checkRegisterValues(res,a,b,c,d,e,f){
	if(a==""|| null){
		return false;
	}
	if(b==""|| null){
		return false;
	}	
	if(c==""|| null){
		return false;
	}	
	if(d==""|| null){
		return false;		
	}
	if(e==""|| null){
		return false;	
	}
	if(f==""|| null){
		return false;	
	}
	return true;
}
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
function(req, res){
   if(req.body.remember){
    req.session.cookie.maxAge = 1000 * 60 * 3;
   }else{
    req.session.cookie.expires = false;
   }
   res.redirect('/');
}
*/
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