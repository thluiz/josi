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
const logger_service_1 = require("../../src/services/logger-service");
const sql = require("mssql");
const card_services_1 = require("../../domain/services/card_services");
const auth = require("../../src/middlewares/auth");
const security_service_1 = require("../../src/services/security-service");
const cards_repository_1 = require("../../src/repositories/cards-repository");
const errors_codes_1 = require("../../src/helpers/errors-codes");
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    const card_service = new card_services_1.CardService(pool);
    app.get("/api/cards/:id", auth.ensureLoggedIn(), (req, res, _next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input("card", sql.Int, req.params.id)
            .query(`select * from vwCard where id = @card for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/person_card_positions", auth.ensureLoggedIn(), (_req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from person_card_position where active = 1 for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/operators", auth.ensureLoggedIn(), (_req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select *
                from vwPerson v
                where is_operator = 1 or is_director = 1 or is_manager = 1
                order by name for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/card_templates", auth.ensureLoggedIn(), (_, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select *
                from card_template
                where active = 1
                order by [order]
                for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/organizations/flat", auth.ensureLoggedIn(), (_, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetFlatOrganizationsData`);
        let response = result.recordset[0];
        res.send(response);
    }));
    app.get("/api/organizations/:id?/:include_childrens?", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield cards_repository_1.CardsRepository.getOrganizations(req.params.id, req.params.include_childrens);
            let response = result.data;
            res.send(response[0].empty ? [] : req.params.id > 0 ? response[0] : response);
        }
        catch (error) {
            logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.CardsActions, error);
            res.status(500).json(error);
        }
    }));
    app.get("/api/projects/:id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        try {
            let result = yield cards_repository_1.CardsRepository.getProject(req.params.id);
            let response = result.data;
            res.send(response[0].empty ? [] :
                req.params.id > 0 ? response[0] : response);
        }
        catch (error) {
            logger_service_1.LoggerService.error(errors_codes_1.ErrorCode.CardsActions, error);
            res.status(500).json(error);
        }
    }));
    app.post("/api/person_cards", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        let result = yield card_service.save_person_card(req.body.person_card);
        res.send(result);
    }));
    app.post("/api/cards", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(req);
        let result = yield card_service.save_card(req.body.card, yield user.getPersonId());
        let response = result.recordset[0];
        res.send(response[0].empty ? [] :
            req.params.id > 0 ? response[0] : response);
    }));
    app.post("/api/move_card", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(req);
        const result = yield new sql.Request(pool)
            .input("card_id", sql.Int, req.body.card_id)
            .input("parent_id", sql.Int, req.body.parent_id)
            .input("step_id", sql.Int, req.body.step_id)
            .input("responsible_id", sql.Int, yield user.getPersonId())
            .execute(`MoveCard`);
        let response = result.recordset[0];
        res.send(response);
    }));
    app.post("/api/cards_comments", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(req);
        let result = yield card_service.save_card_comment(req.body.card, req.body.comment, req.body.commentary_type, yield user.getPersonId());
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/cards_comments/:card_id", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input("card_id", sql.Int, req.params.card_id)
            .execute(`GetCardCommentaries`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.post("/api/cards/steps", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(req);
        let result = yield card_service.save_card_step(req.body.card_id, req.body.step_id, yield user.getPersonId());
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response[0]);
    }));
    app.post("/api/cards/steps/card_order", auth.ensureLoggedIn(), (req, res) => __awaiter(this, void 0, void 0, function* () {
        let result = yield card_service.save_card_order(req.body.card_id, req.body.order);
        res.send(result);
    }));
    app.post("/api/person_cards/delete", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let result = yield card_service.remove_person_card(req.body.person_card);
        res.send(result);
    }));
    app.post("/api/archive_card", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        let user = yield security_service_1.SecurityService.getUserFromRequest(req);
        let result = yield card_service.toggle_card_archived(req.body.card, yield user.getPersonId());
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response[0]);
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=cards-routes.js.map