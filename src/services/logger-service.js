"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const winston = require('winston');
class LoggerService {
    static log(msg, obj, level = 'info') {
        if (this.logger == null) {
            this.logger = this.create_logger();
        }
        this.logger.log(level, msg, obj);
    }
    static create_logger() {
        winston.add(winston.transports.File, { filename: 'logger.log' });
        winston.remove(winston.transports.Console);
        return winston;
    }
}
exports.LoggerService = LoggerService;
//# sourceMappingURL=logger-service.js.map