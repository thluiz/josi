"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class DatabaseParameterFacility {
    static build(key, value) {
        let obj = new Object();
        obj[key] = value;
        return obj;
    }
}
exports.DatabaseParameterFacility = DatabaseParameterFacility;
//# sourceMappingURL=database-parameter-facility.js.map