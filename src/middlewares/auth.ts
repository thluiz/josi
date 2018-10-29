import passport = require("passport");
import { LoggerService } from "../services/logger-service";
import { Permissions, SecurityService } from "../services/security-service";

export function ensureLoggedIn() {
    return (req, res, next) => {
        if (!req.isAuthenticated || !req.isAuthenticated()) {
            res.status(401).json({
                success: false,
                message: "You need to be authenticated to access this page!"
            });
        } else {
            next();
        }
    };
}

export function ensureHasPermission(permission: Permissions) {
    return (req, res, next) => {
        new SecurityService().getUserFromRequest(req)
        .then((user) => {
            new SecurityService().checkUserHasPermission(user, permission)
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
            LoggerService.log("ensureHasPermission - error", error);
            res.status(503).json({
                success: false,
                message: "sorry! something went wrong..."
            });
            return;
        });
    };
}
