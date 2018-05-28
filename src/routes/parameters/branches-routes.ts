import * as auth from '../../../src/middlewares/auth';
import { DatabaseFacility } from '../../facilities/database-facility';

export function routes(app) {    
    app.get("/api/branches/:id?", 
    auth.ensureLoggedIn(),
    async (req, res, next) => {                        
        try {            
            const result = !req.params.id ? 
                await DatabaseFacility.ExecuteJsonSP(`GetBranches`)
                : await DatabaseFacility.ExecuteJsonSQL(
                        `select * from vwBranch where id = @0 for json path`, 
                        req.params.id);   

            res.send(result.data);            
        } catch (error) {
            res.status(500).json({ error });
        }                            
    });
}
