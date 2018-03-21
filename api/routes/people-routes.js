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
const security_services_1 = require("../../domain/services/security_services");
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    const person_service = new person_services_1.PersonService(pool);
    app.get("/api/people/members", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetMembersList`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/people", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetPeopleList`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/people/:id", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('id', sql.Int, request.params.id)
            .execute(`GetPersonData`);
        response.send(result.recordset[0][0]);
    }));
    app.get("/api/people/search/:name?", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('names', sql.VarChar(sql.MAX), request.params.name)
            .execute(`GetPeopleByNameForTypeahead`);
        response.send(result.recordset[0]);
    }));
    app.post("/api/people", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield person_service.update_person_data(request.body.person);
            res.send(result.recordset[0][0]);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.post("/api/person", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield person_service.register_new_person(req.body.person, security_services_1.SecurityService.getUserFromRequest(req));
            res.send(result.recordset[0][0]);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.get("/api/interested", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
            .input('name', sql.VarChar(150), req.query.name)
            .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
            .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
            .execute(`GetPeopleInterested`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/people-away", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
            .input('name', sql.VarChar(150), req.query.name)
            .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
            .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
            .execute(`GetPeopleAway`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/service-providers", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
            .input('name', sql.VarChar(150), req.query.name)
            .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
            .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
            .execute(`GetPeopleServiceProvider`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/people/:id", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('id', sql.Int, request.params.id)
            .execute(`GetPersonData`);
        response.send(result.recordset[0][0]);
    }));
    app.get("/api/person_address/:person_id", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('person_id', sql.Int, request.params.person_id)
            .execute(`GetPersonAddress`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/person_communication/pending/:person_id", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('person_id', sql.Int, request.params.person_id)
            .execute(`GetPersonPendingCommunication`);
        let response = result.recordset[0];
        res.send(response);
    }));
    app.get("/api/person_financial/pending/:person_id", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('person_id', sql.Int, request.params.person_id)
            .execute(`GetPersonPendingFinancial`);
        let response = result.recordset[0];
        res.send(response);
    }));
    app.get("/api/person_schedule/pending/:person_id", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('person_id', sql.Int, request.params.person_id)
            .execute(`GetPersonPendingSchedule`);
        let response = result.recordset[0];
        res.send(response);
    }));
    app.post("/api/person_address", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.save_address(request.body.address);
        response.send({ sucess: true });
    }));
    app.post("/api/person_address/archive", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.archive_address(request.body.person_address);
        response.send({ sucess: true });
    }));
    /**
     * ROLES
     */
    app.post("/api/person_role/delete", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.remove_role(request.body.person_id, request.body.role_id);
        response.send({ sucess: true });
    }));
    app.get("/api/person_role", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetPeopleList`);
        response.send(result.recordset[0]);
    }));
    app.post("/api/person_role", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.add_role(request.body.person_id, request.body.role_id);
        response.send({ sucess: true });
    }));
    app.get("/api/person_role/person/:id", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('person_id', sql.Int, request.params.id)
            .execute(`GetPersonRoles`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    /**
     * ALIAS
     */
    app.post("/api/people_alias/kf_name", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.change_kf_name(request.body.person_id, request.body.kf_name, request.body.ideograms);
        response.send({ sucess: true });
    }));
    /**
     * CONTACTS
    */
    app.post("/api/person_contact/remove", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.remove_contact(request.body.contact_id);
        response.send({ sucess: true });
    }));
    app.post("/api/person_contact", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield person_service.save_contact({
                person_id: request.body.person_id,
                contact_type: request.body.contact_type,
                contact: request.body.contact,
                details: request.body.details,
                principal: request.body.principal
            });
            res.send({ sucess: true });
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.get("/api/person_contact/person/:id/:only_principal?", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.get("/api/person/missing_data/:id", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.post("/api/person_schedule/delete", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.remove_schedule(request.body.id);
        response.send({ sucess: true });
    }));
    app.get("/api/person_schedule/person/:id", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.post("/api/person_schedule", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.save_schedule(request.body.schedule);
        response.send({ sucess: true });
    }));
    /**
     * COMMENTS
     */
    app.get("/api/people_comments/about/:id/:show_archived?", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new sql.Request(pool)
                .input('person_id', sql.Int, request.params.id)
                .input('show_archived', sql.Int, request.params.show_archived || 0)
                .execute(`GetCommentsAboutPerson`);
            let response = result.recordset[0];
            res.send(response[0].empty ? [] : response);
        }
        catch (error) {
            console.log(error);
            res.status(500).json(error);
        }
    }));
    app.post("/api/people_comments/about", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.save_comment_about(request.body.person_id, request.body.comment);
        response.send({ sucess: true });
    }));
    app.post("/api/people_comments/archive", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.archive_comment(request.body.id);
        response.send({ sucess: true });
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=people-routes.js.map