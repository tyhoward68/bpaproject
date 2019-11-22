var passport = require('passport');
var User = require('../models/user');
var LocalStrategy = require('passport-local').Strategy;



passport.serializeUser(function(user, done){
    done(null, user.id);
});

passport.deserializeUser(function(id, done){
    User.findById(id, function(err, user){
        done(err, user);
    });
});

/*
const { check, validationResult } = require('express-validator');

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){
    check('email','Invalid email').isLength({min:1}).isEmail();
    check('password','Invalid password').isLength({min:4});


    var errors = validationResult(req);
    if (errors) {
        var messages =errors.array();
        return done(null, false, req.flash('error', messages));
    }
    console.log(email);
    User.findOne({'email': email}, function(err, user){
        console.log(user);
        if (err) {
            return done(err);
        }
        if (user) {
            console.log("email in use");
            return done(null, false, {message: 'Email is already in use.'});
            
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if (err){
                return done(err);
            }
            return done(null, newUser);
        })
    });
}));

*/


const { check, validationResult } = require('express-validator');

passport.use('local.signup', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done){ [
    check('email','Invalid email').isLength({min:1}).isEmail(),
    check('password','Invalid password').isLength({min:4});

], (req, res) => {
    // Finds the validation errors in this request and wraps them in an object with handy functions
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(422).json({ errors: errors.array() });
    }
  
    User.create({
      username: req.body.username,
      password: req.body.password
    }).then(user => res.json(user));
  });


    var errors = validationResult(req);
    if (errors) {
        var messages =errors.array();
        return done(null, false, req.flash('error', messages));
    }
    console.log(email);
    User.findOne({'email': email}, function(err, user){
        console.log(user);
        if (err) {
            return done(err);
        }
        if (user) {
            console.log("email in use");
            return done(null, false, {message: 'Email is already in use.'});
            
        }
        var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if (err){
                return done(err);
            }
            return done(null, newUser);
        })
    });
}));



passport.use('local.signin', new LocalStrategy({
    usernamefield: 'email',
    passwordField: 'password',
    passReqToCallback: true
}, function(req, email, password, done) {
    req.checkBody('email','Invalid email').notEmpty().isEmail();
    req.checkBody('password','Invalid password').notEmpty();


    var errors = req.validationErrors();
    if (errors) {
        var messages = [];
        errors.forEach(function(error){
            messages.push(error.msg);
        });
        return done(null, false, req.flash('error', messages));
    }

    var newUser = new User();
        newUser.email = email;
        newUser.password = newUser.encryptPassword(password);
        newUser.save(function(err, result){
            if (err){
                return done(err);
            }
            return done(null, newUser);
        })






    User.findOne({'email': email}, function(err, user){
        console.log(user);
        if (err) {
            return done(err);
        }
        if (!user) {
            console.log("email in use");
            return done(null, false, {message: 'No user found.'});
            
        }
        if (!user.validPassword(password)){
            return done(null,false, {message: 'Wrong password'});
        }
        return done(null, user);
        
    });
}));