import { DatabaseManager } from "../services/managers/database-manager";
import { User } from "../entity/User";

const express = require('express');
const AzureSessionStore = require('../middlewares/azure-session-storage');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const session = require('express-session');

let DBM = new DatabaseManager();

export function initialize(app) {

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, cb) => {
        let ru = await DBM.getRepository(User);
        let user = await ru.findOne({ email: profile.emails[0].value });
        if(user == null) {
            cb(null, false);
            return;
        }

        cb(null, user);
      }
    ));

    passport.serializeUser(function(user : User, done) {
        done(null, user.token);
    });


    passport.deserializeUser(async function(token, done) {
        let ru = await DBM.getRepository(User);
        let user = await ru.manager.createQueryBuilder()
                    .innerJoinAndSelect("u.person", "p")
                    .where("u.token = :token", { token: token })
                    .cache(10000)
                    .getOne();

        if(user == null && done) {
            done("USER_NOT_FOUND", false);
            return;
        }

        if(done) {
            done(null, user);
            return;
        }
    });

    app.use(session({
            secret: process.env.EXPRESS_SESSION_KEY,
            resave: false,
            maxAge: 6 * 60 * 60 * 1000, // 6 hours
            saveUninitialized: true,
            cookie: { secure: false },
            store: new AzureSessionStore({
                secret: process.env.EXPRESS_SESSION_KEY,
                resave: false,
                maxAge: 6 * 60 * 60 * 1000, // 6 hours
                saveUninitialized: true
            })
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.get('/auth/google', passport.authenticate('google', { scope: ['profile', 'email'] }));

    app.get('/auth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login_error' }),
        function (req, res) {
            res.redirect(process.env.SITE_URL);
        });

    app.get('/oauth/google/callback',
        passport.authenticate('google', { failureRedirect: '/login_error' }),
        function (req, res) {
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

}
