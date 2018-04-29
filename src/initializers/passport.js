"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_facility_1 = require("../facilities/database-facility");
const User_1 = require("../entity/User");
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');
function initialize(app) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, (accessToken, refreshToken, profile, cb) => __awaiter(this, void 0, void 0, function* () {
        let ru = yield database_facility_1.DatabaseFacility.getRepository(User_1.User);
        let user = yield ru.findOne({ email: profile.emails[0].value });
        if (user == null) {
            cb(null, false);
            return;
        }
        cb(user);
    })));
    passport.serializeUser(function (user, done) {
        done(null, user.token);
    });
    passport.deserializeUser(function (token, done) {
        return __awaiter(this, void 0, void 0, function* () {
            let ru = yield database_facility_1.DatabaseFacility.getRepository(User_1.User);
            let user = yield ru.findOne({ token: token });
            if (user == null && done) {
                done("USER_NOT_FOUND");
                return;
            }
            if (done) {
                done(null, user);
                return;
            }
            return user;
        });
    });
    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
    app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login_error' }), function (req, res) {
        res.redirect(process.env.SITE_URL);
    });
    app.get('/oauth/google/callback', passport.authenticate('google', { failureRedirect: '/login_error' }), function (req, res) {
        res.redirect(process.env.SITE_URL);
    });
    app.get('/relogin', (req, res, next) => {
        req.logout();
        res.redirect(process.env.SITE_URL);
    });
    app.get('/logout', function (req, res) {
        req.logout();
        res.send("Sessão encerrada");
    });
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(session({
        secret: process.env.EXPRESS_SESSION_KEY,
        resave: false,
        maxAge: 6 * 60 * 60 * 1000,
        saveUninitialized: true,
        cookie: { secure: false }
    }));
}
exports.initialize = initialize;
//# sourceMappingURL=passport.js.map