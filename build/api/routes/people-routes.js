"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = y[op[0] & 2 ? "return" : op[0] ? "throw" : "next"]) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [0, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var sql = require("mssql");
var person_services_1 = require("../../domain/services/person_services");
var security_services_1 = require("../../domain/services/security_services");
function configure_routes(app, connection_pool) {
    var _this = this;
    var pool = connection_pool;
    var person_service = new person_services_1.PersonService(pool);
    app.get("/api/people/members", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .execute("GetMembersList")];
                case 1:
                    result = _a.sent();
                    response.send(result.recordset[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/people", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .execute("GetPeopleList")];
                case 1:
                    result = _a.sent();
                    response.send(result.recordset[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/people/:id", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('id', sql.Int, request.params.id)
                        .execute("GetPersonData")];
                case 1:
                    result = _a.sent();
                    response.send(result.recordset[0][0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/people/search/:name?", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('names', sql.VarChar(sql.MAX), request.params.name)
                        .execute("GetPeopleByNameForTypeahead")];
                case 1:
                    result = _a.sent();
                    response.send(result.recordset[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/people", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, person_service.update_person_data(request.body.person)];
                case 1:
                    result = _a.sent();
                    res.send(result.recordset[0][0]);
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    res.status(500).json(error_1);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/person", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, person_service.register_new_person(req.body.person, security_services_1.SecurityService.getUserFromRequest(req))];
                case 1:
                    result = _a.sent();
                    res.send(result.recordset[0][0]);
                    return [3 /*break*/, 3];
                case 2:
                    error_2 = _a.sent();
                    res.status(500).json(error_2);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/voucher_people", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
                        .input('voucher', sql.Int, req.query.voucher > 0 ? req.query.voucher : null)
                        .input('name', sql.VarChar(150), req.query.name)
                        .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
                        .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
                        .execute("GetPeopleFromVouchers")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/invited_people", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
                        .input('voucher', sql.Int, req.query.voucher > 0 ? req.query.voucher : null)
                        .input('name', sql.VarChar(150), req.query.name)
                        .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
                        .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
                        .execute("GetInvitedPeople")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/interested", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
                        .input('name', sql.VarChar(150), req.query.name)
                        .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
                        .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
                        .execute("GetPeopleInterested")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/people-away", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
                        .input('name', sql.VarChar(150), req.query.name)
                        .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
                        .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
                        .execute("GetPeopleAway")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/service-providers", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
                        .input('name', sql.VarChar(150), req.query.name)
                        .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
                        .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
                        .execute("GetPeopleServiceProvider")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/people/:id", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('id', sql.Int, request.params.id)
                        .execute("GetPersonData")];
                case 1:
                    result = _a.sent();
                    response.send(result.recordset[0][0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/person_address/:person_id", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('person_id', sql.Int, request.params.person_id)
                        .execute("GetPersonAddress")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/person_communication/pending/:person_id", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('person_id', sql.Int, request.params.person_id)
                        .execute("GetPersonPendingCommunication")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/person_financial/pending/:person_id", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('person_id', sql.Int, request.params.person_id)
                        .execute("GetPersonPendingFinancial")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/person_schedule/pending/:person_id", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('person_id', sql.Int, request.params.person_id)
                        .execute("GetPersonPendingSchedule")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/person_address", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, person_service.save_address(request.body.address)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/person_address/archive", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, person_service.archive_address(request.body.person_address)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * ROLES
     */
    app.post("/api/person_role/delete", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, person_service.remove_role(request.body.person_id, request.body.role_id)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/person_role", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .execute("GetPeopleList")];
                case 1:
                    result = _a.sent();
                    response.send(result.recordset[0]);
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/person_role", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, person_service.add_role(request.body.person_id, request.body.role_id)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/person_role/person/:id", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .input('person_id', sql.Int, request.params.id)
                        .execute("GetPersonRoles")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * ALIAS
     */
    app.post("/api/people_alias/kf_name", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, person_service.change_kf_name(request.body.person_id, request.body.kf_name, request.body.ideograms)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * CONTACTS
    */
    app.post("/api/person_contact/remove", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, person_service.remove_contact(request.body.contact_id)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/person_contact", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_3;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, person_service.save_contact({
                            person_id: request.body.person_id,
                            contact_type: request.body.contact_type,
                            contact: request.body.contact,
                            details: request.body.details,
                            principal: request.body.principal
                        })];
                case 1:
                    result = _a.sent();
                    res.send({ sucess: true });
                    return [3 /*break*/, 3];
                case 2:
                    error_3 = _a.sent();
                    res.status(500).json(error_3);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/person_contact/person/:id/:only_principal?", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response, error_4;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('person_id', sql.Int, request.params.id)
                            .input('only_principal', sql.Int, request.params.only_principal || 0)
                            .execute("GetPersonContacts")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [3 /*break*/, 3];
                case 2:
                    error_4 = _a.sent();
                    console.log(error_4);
                    res.status(500).json(error_4);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/person/missing_data/:id", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response, error_5;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('person_id', sql.Int, request.params.id)
                            .execute("GetPersonMissingData")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [3 /*break*/, 3];
                case 2:
                    error_5 = _a.sent();
                    console.log(error_5);
                    res.status(500).json(error_5);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    /**
     * PARTNERSHIP INDICATIONS
     */
    app.get("/api/person_partnerships/person/:id", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response, error_6;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new sql.Request(pool)
                            .input("person", sql.Int, req.params.id)
                            .query("select * from person_partnership \n                    where person_id = @person \n                    for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response);
                    return [3 /*break*/, 3];
                case 2:
                    error_6 = _a.sent();
                    if (error_6.code = 'EJSON') {
                        res.send([]);
                    }
                    else {
                        console.log(error_6);
                        res.status(500).json(error_6);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/person_partnerships", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var partnership, result, error_7;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    partnership = req.body.partnership;
                    console.log(partnership);
                    return [4 /*yield*/, new sql.Request(pool)
                            .input("person_id", sql.Int, partnership.person_id)
                            .input('comments', sql.VarChar(sql.MAX), partnership.comment)
                            .input('name', sql.VarChar(250), partnership.name)
                            .input("branch_id", sql.Int, partnership.branch_id)
                            .input("operator_id", sql.Int, partnership.operator_id)
                            .input("indication_contact_type", sql.Int, partnership.indication_contact_type)
                            .execute("SaveNewPartnership")];
                case 1:
                    result = _a.sent();
                    res.send({ success: true });
                    return [3 /*break*/, 3];
                case 2:
                    error_7 = _a.sent();
                    if (error_7.code = 'EJSON') {
                        res.send([]);
                    }
                    else {
                        console.log(error_7);
                        res.status(500).json(error_7);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    /**
     * EXTERNAL UNIT INDICATIONS
     */
    app.get("/api/person_external_units/person/:id", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response, error_8;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new sql.Request(pool)
                            .input("person", sql.Int, req.params.id)
                            .query("select * from person_external_unit \n                    where person_id = @person \n                    for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response);
                    return [3 /*break*/, 3];
                case 2:
                    error_8 = _a.sent();
                    if (error_8.code = 'EJSON') {
                        res.send([]);
                    }
                    else {
                        console.log(error_8);
                        res.status(500).json(error_8);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/person_external_units", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var external_unit, result, error_9;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    external_unit = req.body.external_unit;
                    return [4 /*yield*/, new sql.Request(pool)
                            .input("person_id", sql.Int, external_unit.person_id)
                            .input('comments', sql.VarChar(sql.MAX), external_unit.comment)
                            .input('name', sql.VarChar(250), external_unit.name)
                            .input("branch_id", sql.Int, external_unit.branch_id)
                            .input("operator_id", sql.Int, external_unit.operator_id)
                            .input("indication_contact_type", sql.Int, external_unit.indication_contact_type)
                            .execute("SaveNewExternalUnit")];
                case 1:
                    result = _a.sent();
                    res.send({ success: true });
                    return [3 /*break*/, 3];
                case 2:
                    error_9 = _a.sent();
                    if (error_9.code = 'EJSON') {
                        res.send([]);
                    }
                    else {
                        console.log(error_9);
                        res.status(500).json(error_9);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    /**
     * INDICATIONS
     */
    app.get("/api/person_indications/person/:id", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response, error_10;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new sql.Request(pool)
                            .input("person", sql.Int, req.params.id)
                            .query("select * from vwPersonRelationships \n                    where relationship_type = 10 and person_id = @person \n                    for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response);
                    return [3 /*break*/, 3];
                case 2:
                    error_10 = _a.sent();
                    if (error_10.code = 'EJSON') {
                        res.send([]);
                    }
                    else {
                        console.log(error_10);
                        res.status(500).json(error_10);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/person_indications", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var indication, result, error_11;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    indication = req.body.indication;
                    return [4 /*yield*/, new sql.Request(pool)
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
                            .execute("SaveNewIndication")];
                case 1:
                    result = _a.sent();
                    res.send({ success: true });
                    return [3 /*break*/, 3];
                case 2:
                    error_11 = _a.sent();
                    if (error_11.code = 'EJSON') {
                        res.send([]);
                    }
                    else {
                        console.log(error_11);
                        res.status(500).json(error_11);
                    }
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    /**
     * SCHEDULING
     */
    app.post("/api/person_schedule/delete", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, person_service.remove_schedule(request.body.id)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/person_schedule/person/:id", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response, error_12;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('person_id', sql.Int, request.params.id)
                            .execute("GetPersonScheduling")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [3 /*break*/, 3];
                case 2:
                    error_12 = _a.sent();
                    res.status(500).json(error_12);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/person_schedule", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, person_service.save_schedule(request.body.schedule)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    /**
     * COMMENTS
     */
    app.get("/api/people_comments/about/:id/:show_archived?", security_services_1.SecurityService.ensureLoggedIn(), function (request, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response, error_13;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('person_id', sql.Int, request.params.id)
                            .input('show_archived', sql.Int, request.params.show_archived || 0)
                            .execute("GetCommentsAboutPerson")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [3 /*break*/, 3];
                case 2:
                    error_13 = _a.sent();
                    console.log(error_13);
                    res.status(500).json(error_13);
                    return [3 /*break*/, 3];
                case 3: return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/people_comments/about", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, person_service.save_comment_about(request.body.person_id, request.body.comment)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/people_comments/archive", security_services_1.SecurityService.ensureLoggedIn(), function (request, response, next) { return __awaiter(_this, void 0, void 0, function () {
        var result;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, person_service.archive_comment(request.body.id)];
                case 1:
                    result = _a.sent();
                    response.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=people-routes.js.map