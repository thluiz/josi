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
const auth = require("../../src/middlewares/auth");
const security_service_1 = require("../../src/services/security-service");
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    const person_service = new person_services_1.PersonService(pool);
    app.get("/api/people/members", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetMembersList`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/people", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetPeopleList`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/people/:id", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('id', sql.Int, request.params.id)
            .execute(`GetPersonData`);
        response.send(result.recordset[0][0]);
    }));
    app.get("/api/people/search/:name?", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('names', sql.VarChar(sql.MAX), request.params.name)
            .execute(`GetPeopleByNameForTypeahead`);
        response.send(result.recordset[0]);
    }));
    app.post("/api/people", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield person_service.update_person_data(request.body.person);
            res.send(result.recordset[0][0]);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.post("/api/person", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield person_service.register_new_person(req.body.person, security_service_1.SecurityService.getUserFromRequest(req));
            res.send(result.recordset[0][0]);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.get("/api/voucher_people", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
            .input('voucher', sql.Int, req.query.voucher > 0 ? req.query.voucher : null)
            .input('name', sql.VarChar(150), req.query.name)
            .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
            .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
            .execute(`GetPeopleFromVouchers`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/invited_people", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
            .input('voucher', sql.Int, req.query.voucher > 0 ? req.query.voucher : null)
            .input('name', sql.VarChar(150), req.query.name)
            .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
            .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
            .execute(`GetInvitedPeople`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/interested", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
            .input('name', sql.VarChar(150), req.query.name)
            .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
            .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
            .execute(`GetPeopleInterested`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/people-away", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
            .input('name', sql.VarChar(150), req.query.name)
            .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
            .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
            .execute(`GetPeopleAway`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/service-providers", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
            .input('name', sql.VarChar(150), req.query.name)
            .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
            .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
            .execute(`GetPeopleServiceProvider`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/people/:id", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('id', sql.Int, request.params.id)
            .execute(`GetPersonData`);
        response.send(result.recordset[0][0]);
    }));
    app.get("/api/person_address/:person_id", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('person_id', sql.Int, request.params.person_id)
            .execute(`GetPersonAddress`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/person_communication/pending/:person_id", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('person_id', sql.Int, request.params.person_id)
            .execute(`GetPersonPendingCommunication`);
        let response = result.recordset[0];
        res.send(response);
    }));
    app.get("/api/person_financial/pending/:person_id", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('person_id', sql.Int, request.params.person_id)
            .execute(`GetPersonPendingFinancial`);
        let response = result.recordset[0];
        res.send(response);
    }));
    app.get("/api/person_schedule/pending/:person_id", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('person_id', sql.Int, request.params.person_id)
            .execute(`GetPersonPendingSchedule`);
        let response = result.recordset[0];
        res.send(response);
    }));
    app.post("/api/person_address", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.save_address(request.body.address);
        response.send({ sucess: true });
    }));
    app.post("/api/person_address/archive", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.archive_address(request.body.person_address);
        response.send({ sucess: true });
    }));
    /**
     * ROLES
     */
    app.post("/api/person_role/delete", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.remove_role(request.body.person_id, request.body.role_id);
        response.send({ sucess: true });
    }));
    app.get("/api/person_role", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetPeopleList`);
        response.send(result.recordset[0]);
    }));
    app.post("/api/person_role", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.add_role(request.body.person_id, request.body.role_id);
        response.send({ sucess: true });
    }));
    app.get("/api/person_role/person/:id", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('person_id', sql.Int, request.params.id)
            .execute(`GetPersonRoles`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    /**
     * ALIAS
     */
    app.post("/api/people_alias/kf_name", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.change_kf_name(request.body.person_id, request.body.kf_name, request.body.ideograms);
        response.send({ sucess: true });
    }));
    /**
     * CONTACTS
    */
    app.post("/api/person_contact/remove", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.remove_contact(request.body.contact_id);
        response.send({ sucess: true });
    }));
    app.post("/api/person_contact", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.get("/api/person_contact/person/:id/:only_principal?", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.get("/api/person/missing_data/:id", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
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
     * PARTNERSHIP INDICATIONS
     */
    app.get("/api/person_partnerships/person/:id", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new sql.Request(pool)
                .input("person", sql.Int, req.params.id)
                .query(`select * from person_partnership 
                    where person_id = @person 
                    for json path`);
            let response = result.recordset[0];
            res.send(response);
        }
        catch (error) {
            if (error.code = 'EJSON') {
                res.send([]);
            }
            else {
                console.log(error);
                res.status(500).json(error);
            }
        }
    }));
    app.post("/api/person_partnerships", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let partnership = req.body.partnership;
            console.log(partnership);
            const result = yield new sql.Request(pool)
                .input("person_id", sql.Int, partnership.person_id)
                .input('comments', sql.VarChar(sql.MAX), partnership.comment)
                .input('name', sql.VarChar(250), partnership.name)
                .input("branch_id", sql.Int, partnership.branch_id)
                .input("operator_id", sql.Int, partnership.operator_id)
                .input("indication_contact_type", sql.Int, partnership.indication_contact_type)
                .execute(`SaveNewPartnership`);
            res.send({ success: true });
        }
        catch (error) {
            if (error.code = 'EJSON') {
                res.send([]);
            }
            else {
                console.log(error);
                res.status(500).json(error);
            }
        }
    }));
    /**
     * EXTERNAL UNIT INDICATIONS
     */
    app.get("/api/person_external_units/person/:id", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new sql.Request(pool)
                .input("person", sql.Int, req.params.id)
                .query(`select * from person_external_unit 
                    where person_id = @person 
                    for json path`);
            let response = result.recordset[0];
            res.send(response);
        }
        catch (error) {
            if (error.code = 'EJSON') {
                res.send([]);
            }
            else {
                console.log(error);
                res.status(500).json(error);
            }
        }
    }));
    app.post("/api/person_external_units", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let external_unit = req.body.external_unit;
            const result = yield new sql.Request(pool)
                .input("person_id", sql.Int, external_unit.person_id)
                .input('comments', sql.VarChar(sql.MAX), external_unit.comment)
                .input('name', sql.VarChar(250), external_unit.name)
                .input("branch_id", sql.Int, external_unit.branch_id)
                .input("operator_id", sql.Int, external_unit.operator_id)
                .input("indication_contact_type", sql.Int, external_unit.indication_contact_type)
                .execute(`SaveNewExternalUnit`);
            res.send({ success: true });
        }
        catch (error) {
            if (error.code = 'EJSON') {
                res.send([]);
            }
            else {
                console.log(error);
                res.status(500).json(error);
            }
        }
    }));
    /**
     * INDICATIONS
     */
    app.get("/api/person_indications/person/:id", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new sql.Request(pool)
                .input("person", sql.Int, req.params.id)
                .query(`select * from vwPersonRelationships 
                    where relationship_type = 10 and person_id = @person 
                    for json path`);
            let response = result.recordset[0];
            res.send(response);
        }
        catch (error) {
            if (error.code = 'EJSON') {
                res.send([]);
            }
            else {
                console.log(error);
                res.status(500).json(error);
            }
        }
    }));
    app.post("/api/person_indications", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            let indication = req.body.indication;
            const result = yield new sql.Request(pool)
                .input("person_id", sql.Int, indication.person_id)
                .input("contact_type1", sql.Int, indication.contact_type1)
                .input("contact_type2", sql.Int, indication.contact_type2)
                .input("contact_type3", sql.Int, indication.contact_type3)
                .input('comments', sql.VarChar(sql.MAX), indication.comment)
                .input('name', sql.VarChar(250), indication.name)
                .input('contact1', sql.VarChar(250), indication.contact1)
                .input('contact2', sql.VarChar(250), indication.contact2)
                .input('contact3', sql.VarChar(250), indication.contact3)
                .input("indication_contact_type", sql.Int, indication.indication_contact_type)
                .input("branch_id", sql.Int, indication.branch_id)
                .input("operator_id", sql.Int, indication.operator_id)
                .execute(`SaveNewIndication`);
            res.send({ success: true });
        }
        catch (error) {
            if (error.code = 'EJSON') {
                res.send([]);
            }
            else {
                console.log(error);
                res.status(500).json(error);
            }
        }
    }));
    /**
     * SCHEDULING
     */
    app.post("/api/person_schedule/delete", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.remove_schedule(request.body.id);
        response.send({ sucess: true });
    }));
    app.get("/api/person_schedule/person/:id", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.post("/api/person_schedule", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.save_schedule(request.body.schedule);
        response.send({ sucess: true });
    }));
    /**
     * COMMENTS
     */
    app.get("/api/people_comments/about/:id/:show_archived?", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.post("/api/people_comments/about", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.save_comment_about(request.body.person_id, request.body.comment);
        response.send({ sucess: true });
    }));
    app.post("/api/people_comments/archive", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield person_service.archive_comment(request.body.id);
        response.send({ sucess: true });
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=people-routes.js.map