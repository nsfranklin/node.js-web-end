var mysql = require('mysql');
var bcrypy = require('bcrypyjs');


/* Set User Schema
var UserSchema = new mongoose.Schema({
    username: {
      type: String,
      index: true
    },
    password: {
      type: String
    },  
    email: {
      type: String
    },
    name:{
      type: String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){

  bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, function(err, hash){
            newUser.password = hash;
            newUser.save(callback);
             
              });
          });
        
  
}
*/