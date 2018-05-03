import { SecurityService } from './../services/security-service';
import { DatabaseFacility } from './../facilities/database-facility';
import { Permissions } from "../services/security-service";
import { User } from '../entity/User';
import { LoggerService } from '../services/logger-service';

export function ensureLoggedIn() {
    return function(req, res, next) {        
        if(process.env.LOAD_ENV === 'true') {
            if(!req.isAuthenticated || !req.isAuthenticated()) {                
                SecurityService.getUserFromRequest(req).then(user => {
                    req.login(user, function(err){
                        if(err) return next(err);      
                        
                        next();
                    });                    
                });                        
            } else {
                next(); 
            }      

            return; 
        }

        if (!req.isAuthenticated || !req.isAuthenticated()) {
            res.status(401).json({
                success: false,
                message: 'You need to be authenticated to access this page!'
            });
        } else {
            next();
        }
    }
}

export function ensureHasPermission(permission: Permissions) {
    return function (req, res, next) {
        SecurityService.getUserFromRequest(req)
        .then(user => {
            SecurityService.checkUserHasPermission(user, permission)
            .then(has_permission => {
                if(!has_permission) {
                    res.status(403).json({
                        success: false,
                        message: 'You don´t have the necessary permitions for this action!'
                    });            
                    return;
                }     
    
                next();
            })
        })
        .catch((error) => {             
            LoggerService.log('ensureHasPermission - error', error);
            res.status(503).json({
                success: false,
                message: 'sorry! something went wrong...'
            });            
            return;
        });         
    }
}