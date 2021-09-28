const User = require('../models/model')
var bcrypt = require('bcryptjs'); 
var passport = require('passport')

exports.register = async (req, res) => {
const {name, email, password, password2 } = req.body
let errors = [];


// Check required fields
if(!name || !email || !password || !password2){
    errors.push({msg: "Please fill in all fields"});

}
// Check passwords match
if(password !== password2){
    errors.push({msg: "Passwords do not match"});
}
// Check password length
if(password.length < 6 ){
    errors.push({msg: "Password should be at least 6 characters"});
}

if(errors.length > 0){ 
    res.render('register', {
        errors,
        name,
        email,
        password,
        password2
    })
}else {
    User.findOne({email: email})
 .then(user => {
     if(user) {
         // user exists
         errors.push({msg: "Email is already registered"});
         res.render('register', {
            errors,
            name,
            email,
            password,
            password2
        });
     } else {
        const newUser = new User({
            name,
            email,
            password,
        });
        
        // Hash password
        bcrypt.genSalt(10,(err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err;

            newUser.password = hash;
            newUser.save()
              .then(user => {
                  req.flash('success_msg', 'You are now registered✨ and can log in ')
                  res.redirect('/login')
              })
              .catch(err => console.log(err));
        } ) )
        
     }
 });

}


}
exports.getIn = async (req, res, next) => {
    passport.authenticate('local',{
        successRedirect: '/dashboard',
        failureRedirect: '/login',
        failureFlash: true
      })(req, res, next);
}

exports.homepage =  async (req, res) => {
    res.render('Welcome')
}

exports.logout = async (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
}