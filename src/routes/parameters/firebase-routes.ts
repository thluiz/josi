import * as auth from '../../../src/middlewares/auth';
import { DatabaseFacility } from '../../facilities/database-facility';
import { FirebaseService } from '../../services/firebase-service';

export function routes(app) {    
    app.get("/api/firebase/token", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {                                
        const result = await FirebaseService.get_token();

        res.send(result);                                          
    });

    app.get("/api/firebase/current_time", async (req, res, next) => {                
        const dt = new Date();

        res.send({ 
            milliseconds:  dt.getTime(),
            date: dt
        });
    });
}
