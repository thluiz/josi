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
const jobs_service_1 = require("../services/jobs-service");
const sgMail = require('@sendgrid/mail');
function routes(app) {
    app.get("/api/hourly-jobs", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield jobs_service_1.JobsService.execute_hourly_jobs();
        res.send(result);
    }));
    app.get("/api/cleanup-sessions", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield jobs_service_1.JobsService.cleanup_sessions();
        res.send(result);
    }));
    app.get("/api/test-email", (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
            to: 'moychiyausi.myvt@gmail.com',
            from: 'contato@myvtmi.im',
            subject: 'Sending with SendGrid!',
            text: 'Siu Nim Tau, Cham Kiu, Biu Ji...',
            html: '<strong>Tan Sau</strong>, Bong Sau...',
        };
        sgMail.send(msg)
            .then(r2 => {
            console.log(r2);
            res.send("ok v3!");
        })
            .catch(error => {
            //Log friendly error
            console.error(error.toString());
            //Extract error msg
            const { message, code, response } = error;
            console.log(code);
            //Extract response msg
            const { headers, body } = response;
            console.log(headers);
            console.log(body);
            res.send("arg!");
        });
    }));
}
exports.routes = routes;
//# sourceMappingURL=jobs-routes.js.map