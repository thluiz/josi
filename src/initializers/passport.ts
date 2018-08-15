import session = require("express-session");
import passport = require("passport");
import { AzureSessionStore } from "../middlewares/azure-session-storage";

import { User } from "../entity/User";
import { UsersRepository } from "../repositories/users-repository";

// tslint:disable-next-line:no-var-requires
const GoogleStrategy = require("passport-google-oauth20").Strategy;

export function initialize(app) {
    const UR = new UsersRepository();
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, cb) => {
        const resultUser = await UR.getUserByEmail(profile.emails[0].value);

        if (resultUser == null || !resultUser.success) {
            cb(null, false);
            return;
        }

        cb(null, resultUser.data);
      }
    ));

    passport.serializeUser((user: User, done) => {
        done(null, user.token);
    });

    passport.deserializeUser(async (token, done) => {
        const ru = await UR.getUserByToken(token);

        if ((ru == null || !ru.success) && done) {
            done("USER_NOT_FOUND", false);
            return;
        }

        if (done) {
            done(null, ru.data);
            return;
        }
    });

    app.use(session({
            secret: process.env.EXPRESS_SESSION_KEY,
            resave: true,
            saveUninitialized: true,
            cookie: { secure: false },
            store: new AzureSessionStore({
                secret: process.env.EXPRESS_SESSION_KEY,
                resave: true,
                maxAge: 6 * 60 * 60 * 1000, // 6 hours
                saveUninitialized: true
            })
    }));

    app.use(passport.initialize());
    app.use(passport.session());

    app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));

    app.get("/auth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login_error" }),
    (req, res) => {
        res.redirect(process.env.SITE_URL);
    });

    app.get("/oauth/google/callback",
    passport.authenticate("google", { failureRedirect: "/login_error" }),
    (req, res) => {
        res.redirect(process.env.SITE_URL);
    });

    app.get("/relogin",
    (req, res) => {
        req.logout();
        res.redirect(process.env.SITE_URL);
    });

    app.get("/logout",
    (req, res) => {
        req.logout();
        res.send("Sessão encerrada");
    });

}
