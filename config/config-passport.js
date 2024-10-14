const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20');
const User = require('../models/user');

// Google Auth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: '/oauth2/redirect/google',
    scope: ['profile', 'email'],
    state: true,
    proxy: true
},
    function (accessToken, refreshToken, profile, cb) {
        profile.email = profile._json.email;
        return cb(null, profile);
    }
));

passport.serializeUser(function (user, done) {
    console
    done(null, { id: user.id, email: user.email });
});

passport.deserializeUser(
    async function (id, done) {
        try {
            const user = await User.findByPk(id);
            done(null, user);
        } catch (error) {
            done(error)
        }
    }
);

module.exports = passport;