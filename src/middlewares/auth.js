"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const security_service_1 = require("./../services/security-service");
const logger_service_1 = require("../services/logger-service");
function ensureLoggedIn() {
    return function (req, res, next) {
        /*if(process.env.LOAD_ENV === 'true') {
            next();
            return;
        }*/
        logger_service_1.LoggerService.log('ensureLoggedIn - session', req.session);
        logger_service_1.LoggerService.log('ensureLoggedIn - isAuthenticated', req.isAuthenticated());
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            res.status(401).json({
                success: false,
                message: 'You need to be authenticated to access this page!'
            });
        }
        else {
            next();
        }
    };
}
exports.ensureLoggedIn = ensureLoggedIn;
function ensureHasPermission(permission) {
    return function (req, res, next) {
        security_service_1.SecurityService.getUserFromRequest(req)
            .then(user => {
            security_service_1.SecurityService.checkUserHasPermission(user, permission)
                .then(has_permission => {
                if (!has_permission) {
                    res.status(403).json({
                        success: false,
                        message: 'You don´t have the necessary permitions for this action!'
                    });
                    return;
                }
                next();
            });
        })
            .catch((error) => {
            logger_service_1.LoggerService.log('ensureHasPermission - error', error);
            res.status(503).json({
                success: false,
                message: 'sorry! something went wrong...'
            });
            return;
        });
    };
}
exports.ensureHasPermission = ensureHasPermission;
//# sourceMappingURL=auth.js.map