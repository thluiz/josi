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

    app.get("/api/test-email", async (req, res, next) => {                
        
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
        const msg = {
        to: 'th.luiz@gmail.com',
        from: 'contato@myvtmi.im',
        subject: 'Sending with SendGrid!',
        text: 'Siu Nim Tau, Cham Kiu, Biu Ji...',
        html: '<strong>Tan Sau</strong>, Bong Sau...',
        };

        sgMail.send(msg)
                .then(r2 =>  { 
                    console.log(r2);
                    res.send("ok v4!");
                })
                .catch(error => {

                    //Log friendly error
                    console.error(error.toString());
                
                    //Extract error msg
                    const {message, code, response} = error;

                    console.log(code);

                    //Extract response msg
                    const {headers, body} = response;

                    console.log(headers);
                    console.log(body);
                    res.send("arg!");
                });                
    }); 
}
