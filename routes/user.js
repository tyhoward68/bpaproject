var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');

var Order = require ('../models/order');
var Cart = require ('../models/cart');
var User = require ('../models/user');

var csrfProtection = csrf();
router.use(csrfProtection);

router.get('/profile', isLoggedIn, function (req, res, next) {
    Order.find({user: req.user}, function(err, orders) {
        if(err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });
        res.render('user/profile', { orders: orders });
    });
});


router.get('/report1', isAdminLoggedIn, function (req, res, next) {
    req.logout();

    console.log("report1")
    Order.find({}, function(err, orders) {
        if(err) {
            return res.write('Error!');
        }
        var cart;
        orders.forEach(function (order) {
            cart = new Cart(order.cart);
            order.items = cart.generateArray();
        });

        //res.render('user/report1', { orders: orders });
        res.render('user/report1', { orders: orders });
    });
});


router.get('/logout', isLoggedIn, function (req, res, next) {
    req.session.isAdminRole = null;
    req.logout();
    res.redirect('/');
});

router.use('/', notLoggedIn, function (req, res, next) {
    next();
});

router.get('/signup', function (req, res, next) {
    req.session.isAdminRole = null;
    var messages = req.flash('error');
    res.render('user/signup', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/signup', passport.authenticate('local.signup', {
    failureRedirect: '/user/signup',
    failureFlash: true
}), function (req, res, next) {
    if(req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/profile');
    }
});

router.get('/signin', function (req, res, next) {
    req.session.isAdminRole = null;
    var messages = req.flash('error');
    res.render('user/signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});


router.post('/signin', passport.authenticate('local.signin', {
    failureRedirect: '/user/signin',
    failureFlash: true
}), function (req, res, next) {
    if(req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect('/checkout');
    } else {
        res.redirect('/user/profile');
    }
});

router.get('/admin-signin', function (req, res, next) {
    var messages = req.flash('error');
    res.render('user/admin-signin', {csrfToken: req.csrfToken(), messages: messages, hasErrors: messages.length > 0});
});

router.post('/admin-signin', passport.authenticate('admin.signin', {
    failureRedirect: '/user/admin-signin',
    failureFlash: true
}), function (req, res, next) {
    if(req.session.oldUrl) {
        var oldUrl = req.session.oldUrl;
        req.session.oldUrl = null;
        res.redirect(oldUrl);
    } else {
        res.redirect('/user/report1');
    }
});

module.exports = router;

function isAdminLoggedIn(req, res, next) {
    console.log("isadmin");
    console.log(req.isAuthenticated());
    console.log(req.session.isAdminRole)
    if(req.isAuthenticated() && req.session.isAdminRole) {
        return next();
    }
    res.redirect('/user/admin-signin');
}

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}

function notLoggedIn(req, res, next) {
    if(!req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}