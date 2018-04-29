const winston = require('winston');

export class LoggerService {
    private static logger;

    static log(msg, obj, level = 'info') {
        if (this.logger == null) {
           this.logger = this.create_logger();
        }

        this.logger.log(level, msg, obj);
    }

    private static create_logger() {        
        winston.add(winston.transports.File, { filename: 'logger.log' });
        winston.remove(winston.transports.Console);

        return winston; 
    }
}