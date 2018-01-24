"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const sql = require("mssql");
const person_services_1 = require("../../domain/services/person_services");
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    const person_service = new person_services_1.PersonService(pool);
    app.get("/api/people/members", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetMembersList`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/people", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetPeopleList`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/people/:id", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('id', sql.Int, request.params.id)
            .execute(`GetPersonData`);
        response.send(result.recordset[0][0]);
    }));
    app.get("/api/people/search/:name?", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('names', sql.VarChar(sql.MAX), request.params.name)
            .execute(`GetPeopleByNameForTypeahead`);
        response.send(result.recordset[0]);
    }));
    app.post("/api/people", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        console.log(request.body.person);
        const result = yield person_service.update_person_data(request.body.person);
        response.send("Ok");
    }));
    app.get("/api/people/:id", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('id', sql.Int, request.params.id)
            .execute(`GetPersonData`);
        response.send(result.recordset[0][0]);
    }));
    /**
     * ROLES
     */
    app.post("/api/person_role/delete", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.remove_role(request.body.person_id, request.body.role_id);
        response.send("Ok");
    }));
    app.get("/api/person_role", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetPeopleList`);
        response.send(result.recordset[0]);
    }));
    app.post("/api/person_role", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.add_role(request.body.person_id, request.body.role_id);
        response.send("Ok");
    }));
    app.get("/api/person_role/person/:id", (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('person_id', sql.Int, request.params.id)
            .execute(`GetPersonRoles`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    /**
     * ALIAS
     */
    app.post("/api/people_alias/kf_name", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.change_kf_name(request.body.person_id, request.body.kf_name, request.body.ideograms);
        response.send("Ok");
    }));
    /**
     * CONTACTS
    */
    app.post("/api/person_contact/remove", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.remove_contact(request.body.contact_id);
        response.send("Ok");
    }));
    app.post("/api/person_contact", (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield person_service.save_contact({
                person_id: request.body.person_id,
                contact_type: request.body.contact_type,
                contact: request.body.contact,
                details: request.body.details,
                principal: request.body.principal
            });
            res.send("Ok");
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.get("/api/person_contact/person/:id/:only_principal?", (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new sql.Request(pool)
                .input('person_id', sql.Int, request.params.id)
                .input('only_principal', sql.Int, request.params.only_principal || 0)
                .execute(`GetPersonContacts`);
            let response = result.recordset[0];
            res.send(response[0].empty ? [] : response);
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }));
    app.get("/api/person/missing_data/:id", (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new sql.Request(pool)
                .input('person_id', sql.Int, request.params.id)
                .execute(`GetPersonMissingData`);
            let response = result.recordset[0];
            res.send(response[0].empty ? [] : response);
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }));
    /**
     * SCHEDULING
     */
    app.post("/api/person_schedule/delete", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.remove_schedule(request.body.id);
        response.send("Ok");
    }));
    app.get("/api/person_schedule/person/:id", (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield new sql.Request(pool)
                .input('person_id', sql.Int, request.params.id)
                .execute(`GetPersonScheduling`);
            let response = result.recordset[0];
            res.send(response[0].empty ? [] : response);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.post("/api/person_schedule", (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.save_schedule(request.body.schedule);
        response.send("Ok");
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=people-routes.js.map