import { User } from "../entity/User";
import { DatabaseManager } from "../services/managers/database-manager";
import { DependencyManager } from "../services/managers/dependency-manager";

import session = require("express-session");
import passport = require("passport");
import { AzureSessionStore } from "../middlewares/azure-session-storage";

// tslint:disable-next-line:no-var-requires
const GoogleStrategy = require("passport-google-oauth20").Strategy;

export function initialize(app) {
    const DBM = DependencyManager.container.resolve(DatabaseManager);

    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
      },
      async (accessToken, refreshToken, profile, cb) => {
        const ru = await DBM.getRepository(User);
        const user = await ru.findOne({ email: profile.emails[0].value });

        if (user == null) {
            cb(null, false);
            return;
        }

        cb(null, user);
      }
    ));

    passport.serializeUser((user: User, done) => {
        done(null, user.token);
    });

    passport.deserializeUser(async (token, done) => {
        const ru = await DBM.getRepository(User);
        /* let user = await ru.manager.createQueryBuilder()
                    .innerJoinAndSelect("u.person", "p")
                    .where("u.token = :token", { token: token })
                    .cache(10000)
                    .getOne(); */

        const user = await ru.findOne({ token });

        if (user == null && done) {
            done("USER_NOT_FOUND", false);
            return;
        }

        if (done) {
            done(null, user);
            return;
        }
    });

    app.use(session({
            secret: process.env.EXPRESS_SESSION_KEY,
            resave: false,
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
