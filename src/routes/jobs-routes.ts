import { JobsService } from "../services/jobs-service";

const sgMail = require('@sendgrid/mail');

export function routes(app) {
    

    app.get("/api/hourly-jobs", async (req, res, next) => {                
        let result = await JobsService.execute_hourly_jobs();
        
        res.send(result);
    }); 
    
    app.get("/api/cleanup-sessions", async (req, res, next) => {                
        let result = await JobsService.cleanup_sessions();
        
        res.send(result);
    }); 

    app.get("/api/ownership_report", async (req, res, next) => {  
        let result = await JobsService.send_ownership_closing_report(69836);
        
        res.send(result.data.content);
    }); 
}
