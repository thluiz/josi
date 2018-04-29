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
var jobs_services_1 = require("./../../domain/services/jobs_services");
var sql = require("mssql");
var security_services_1 = require("../../domain/services/security_services");
function configure_routes(app, connection_pool) {
    var _this = this;
    var pool = connection_pool;
    var jobs = new jobs_services_1.JobsService(connection_pool);
    app.post("/api/voucher", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    _a.trys.push([0, 2, , 3]);
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('name', sql.VarChar(200), req.body.name)
                            .input('email', sql.VarChar(100), req.body.email)
                            .input('cpf', sql.VarChar(11), req.body.cpf)
                            .input('phone', sql.VarChar(100), req.body.phone)
                            .input('socialLinks', sql.VarChar(100), req.body.socialLinks)
                            .input('branch_id', sql.Int, req.body.unit)
                            .input('voucher_id', sql.Int, req.body.voucher_id || 1)
                            .input('additionalAnswer', sql.VarChar(sql.MAX), req.body.additionalAnswer || '')
                            .input('branch_map_id', sql.Int, req.body.schedule)
                            .execute("CreatePersonFromVoucher")];
                case 1:
                    result = _a.sent();
                    return [3 /*break*/, 3];
                case 2:
                    error_1 = _a.sent();
                    console.log(error_1);
                    return [3 /*break*/, 3];
                case 3:
                    res.send({ sucess: true });
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/voucher", function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .execute("GetDataForVoucher")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.get("/api/parameters/vouchers", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var result, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, new sql.Request(pool)
                        .query("select * from voucher order by title for json path")];
                case 1:
                    result = _a.sent();
                    response = result.recordset[0];
                    res.send(response[0].empty ? [] : response);
                    return [2 /*return*/];
            }
        });
    }); });
    app.post("/api/parameters/vouchers", security_services_1.SecurityService.ensureLoggedIn(), function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
        var voucher, result, start, error_2;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    voucher = req.body.voucher;
                    result = null;
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 6, , 7]);
                    start = Date.now();
                    if (!(voucher.id > 0)) return [3 /*break*/, 3];
                    return [4 /*yield*/, new sql.Request(pool)
                            .input('id', sql.Int, voucher.id)
                            .input('title', sql.VarChar(100), voucher.title)
                            .input('url', sql.VarChar(100), voucher.url)
                            .input('initials', sql.VarChar(3), voucher.initials)
                            .input('additional_question', sql.VarChar(200), voucher.additional_question)
                            .input('header_text', sql.VarChar(sql.MAX), voucher.header_text)
                            .input('final_text', sql.VarChar(sql.MAX), voucher.final_text)
                            .input('confirm_button_text', sql.VarChar(35), voucher.confirm_button_text)
                            .input('header_title', sql.VarChar(40), voucher.header_title)
                            .query("update voucher set\n                            title = @title,\n                            [url] = @url,\n                            header_text = @header_text,\n                            final_text = @final_text,\n                            additional_question = @additional_question,\n                            initials = @initials,\n                            confirm_button_text = @confirm_button_text,\n                            header_title = @header_title\n                        where id = @id")];
                case 2:
                    result = _a.sent();
                    return [3 /*break*/, 5];
                case 3: return [4 /*yield*/, new sql.Request(pool)
                        .input('title', sql.VarChar(100), voucher.title)
                        .input('url', sql.VarChar(100), voucher.url)
                        .input('initials', sql.VarChar(3), voucher.initials)
                        .input('additional_question', sql.VarChar(200), voucher.additional_question)
                        .input('header_text', sql.VarChar(sql.MAX), voucher.header_text)
                        .input('final_text', sql.VarChar(sql.MAX), voucher.final_text)
                        .input('confirm_button_text', sql.VarChar(35), voucher.confirm_button_text)
                        .input('header_title', sql.VarChar(40), voucher.header_title)
                        .query("insert into voucher (title, [url], header_text, final_text, \n                        additional_question, initials, confirm_button_text, header_title)\n                            values (@title, @url, @header_text, @final_text, @additional_question, \n                                    @initials, @confirm_button_text, @header_title)")];
                case 4:
                    result = _a.sent();
                    _a.label = 5;
                case 5:
                    jobs.update_voucher_site();
                    res.send({ sucess: true });
                    return [3 /*break*/, 7];
                case 6:
                    error_2 = _a.sent();
                    res.status(500).json({ url: process.env.VOUCHER_SITE_UPDATE_URL, res: res, error: error_2, voucher: voucher, result: result });
                    return [3 /*break*/, 7];
                case 7: return [2 /*return*/];
            }
        });
    }); });
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=voucher-routes.js.map