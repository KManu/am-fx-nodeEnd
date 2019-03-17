const jwt = require('jsonwebtoken');
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const usersCtrl = require('../controllers/users');
require('dotenv').config();

const jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
jwtOptions.secretOrKey = process.env.TOKEN_SECRET;
jwtOptions.issuer = 'Ex Hub';

const strategy = new JwtStrategy(jwtOptions, function (jwt_payload, done) {
    //console.log('payload received', jwt_payload);
    // usually this would be a database call:
    const valid = false;
    usersCtrl.getUserDetailsByEmail(jwt_payload.email)
        .then(res => {
            return done(null, res);
        })
        .catch(err => {
            return done(err, false);
        });
});
passport.use(strategy);

module.exports.initialize = function () {
    console.log('Pasport Init')
    return passport.initialize();
};


module.exports.passport = passport;
module.exports.jwt = jwt;
module.exports.jwtOptions = jwtOptions;