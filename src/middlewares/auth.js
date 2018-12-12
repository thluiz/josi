"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const logger_service_1 = require("../services/logger-service");
const security_service_1 = require("../services/security-service");
function ensureLoggedIn() {
    return (req, res, next) => {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            res.status(401).json({
                success: false,
                message: "You need to be authenticated to access this page!"
            });
        }
        else {
            next();
        }
    };
}
exports.ensureLoggedIn = ensureLoggedIn;
function ensureHasPermission(permission) {
    return (req, res, next) => {
        new security_service_1.SecurityService().getUserFromRequest(req)
            .then((user) => {
            new security_service_1.SecurityService().checkUserHasPermission(user, permission)
                .then((hasPermission) => {
                if (!hasPermission) {
                    res.status(403).json({
                        success: false,
                        message: "You don´t have the necessary permitions for this action!"
                    });
                    return;
                }
                next();
            });
        })
            .catch((error) => {
            logger_service_1.LoggerService.log("ensureHasPermission - error", error);
            res.status(503).json({
                success: false,
                message: "sorry! something went wrong..."
            });
            return;
        });
    };
}
exports.ensureHasPermission = ensureHasPermission;
//# sourceMappingURL=auth.js.map