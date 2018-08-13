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
const User_1 = require("../entity/User");
const database_manager_1 = require("../services/managers/database-manager");
const dependency_manager_1 = require("../services/managers/dependency-manager");
const session = require("express-session");
const passport = require("passport");
const azure_session_storage_1 = require("../middlewares/azure-session-storage");
// tslint:disable-next-line:no-var-requires
const GoogleStrategy = require("passport-google-oauth20").Strategy;
function initialize(app) {
    const DBM = dependency_manager_1.DependencyManager.container.resolve(database_manager_1.DatabaseManager);
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: process.env.GOOGLE_CALLBACK_URL
    }, (accessToken, refreshToken, profile, cb) => __awaiter(this, void 0, void 0, function* () {
        const ru = yield DBM.getRepository(User_1.User);
        const user = yield ru.findOne({ email: profile.emails[0].value });
        if (user == null) {
            cb(null, false);
            return;
        }
        cb(null, user);
    })));
    passport.serializeUser((user, done) => {
        done(null, user.token);
    });
    passport.deserializeUser((token, done) => __awaiter(this, void 0, void 0, function* () {
        const ru = yield DBM.getRepository(User_1.User);
        /* let user = await ru.manager.createQueryBuilder()
                    .innerJoinAndSelect("u.person", "p")
                    .where("u.token = :token", { token: token })
                    .cache(10000)
                    .getOne(); */
        const user = yield ru.findOne({ token });
        if (user == null && done) {
            done("USER_NOT_FOUND", false);
            return;
        }
        if (done) {
            done(null, user);
            return;
        }
    }));
    app.use(session({
        secret: process.env.EXPRESS_SESSION_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
        store: new azure_session_storage_1.AzureSessionStore({
            secret: process.env.EXPRESS_SESSION_KEY,
            resave: false,
            maxAge: 6 * 60 * 60 * 1000,
            saveUninitialized: false
        })
    }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.get("/auth/google", passport.authenticate("google", { scope: ["profile", "email"] }));
    app.get("/auth/google/callback", passport.authenticate("google", { failureRedirect: "/login_error" }), (req, res) => {
        res.redirect(process.env.SITE_URL);
    });
    app.get("/oauth/google/callback", passport.authenticate("google", { failureRedirect: "/login_error" }), (req, res) => {
        res.redirect(process.env.SITE_URL);
    });
    app.get("/relogin", (req, res) => {
        req.logout();
        res.redirect(process.env.SITE_URL);
    });
    app.get("/logout", (req, res) => {
        req.logout();
        res.send("Sessão encerrada");
    });
}
exports.initialize = initialize;
//# sourceMappingURL=passport.js.map