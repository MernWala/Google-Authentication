require('dotenv').config()
const express = require('express');
const passport = require('passport');
const cookieSession = require('cookie-session');

const app = express();
require('./passport-setup')

app.set("view engine", "ejs")

app.use(cookieSession({
    name: 'google-auth-session',
    keys: ['key1', 'key2'],
}));

app.use(passport.initialize());
app.use(passport.session());

app.get("/", (req, res) => {
    res.render("pages/index")
});

app.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }))

app.get('/google/callback', passport.authenticate('google', { failureRedirect: '/failed' }), (req, res) => {
    res.redirect('/sucess')
})

app.listen(5000, () => {
    console.log("Google Authentication is running at 5000");
})

app.get('/failed', (req, res) => {
    res.send("failed to login");
});

app.get('/sucess', (req, res) => {
    res.json({data: req.user})
    res.render('pages/profile', {name: req.user.displayName, email: req.user.emails[0].value, pic: req.user.photos[0].value})
})

app.get('/logout', (req, res) => {
    req.session = null;
    req.logout();
    res.redirect('/');
})