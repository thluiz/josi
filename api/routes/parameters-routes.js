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
const security_services_1 = require("../../domain/services/security_services");
const jobs_services_1 = require("../../domain/services/jobs_services");
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    let jobs = new jobs_services_1.JobsService(connection_pool);
    app.get("/api/branches/:id?", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        if (!req.params.id) {
            const result = yield new sql.Request(pool)
                .execute(`GetBranches`);
            res.send(result.recordset[0]);
        }
        else {
            const result = yield new sql.Request(pool)
                .input("branch", sql.Int, req.params.id)
                .query(`select * from vwBranch where id = @branch for json path`);
            let response = result.recordset[0];
            res.send(response[0].empty ? [] : response);
        }
    }));
    app.get("/api/branch_maps/branch/:id", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input("branch_id", sql.Int, req.params.id)
            .execute(`GetBranchMap`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/domains", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetDomains`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/programs", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetPrograms`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/configurations", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new sql.Request(pool)
                .query(`select * from [configuration] for json path`);
            let response = result.recordset[0];
            res.send(response);
        }
        catch (error) {
            res.status(500).json(error);
        }
    }));
    app.get("/api/products", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new sql.Request(pool)
                .query(`select * from [vwProduct] for json path`);
            let response = result.recordset[0];
            res.send(response);
        }
        catch (error) {
            if (error.code = 'EJSON') {
                res.send([]);
            }
            else {
                res.status(500).json(error);
            }
        }
    }));
    app.get("/api/product_categories", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new sql.Request(pool)
                .query(`select * from [product_category] for json path`);
            let response = result.recordset[0];
            res.send(response);
        }
        catch (error) {
            if (error.code = 'EJSON') {
                res.send([]);
            }
            else {
                res.status(500).json(error);
            }
        }
    }));
    app.get("/api/countries", security_services_1.SecurityService.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from [country] order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/kf_families", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetKungFuFamilies`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/recurrence_types", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetRecurrenceTypes`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/incident_types", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetIncidentTypes`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/contact_types", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetContactTypes`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/roles", security_services_1.SecurityService.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetRoles`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/groups", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from [group] where active = 1 order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/locations", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from [location] where active = 1 order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/payment_methods", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from payment_method where active = 1 order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/acquirers", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from acquirer where active = 1 order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/currencies", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from currency for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    /**
     * UPDATES
     */
    app.post("/api/branches", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const branch = req.body.branch;
        const result = yield new sql.Request(pool)
            .input('id', sql.Int, branch.id)
            .input('name', sql.VarChar(100), branch.name)
            .input('abrev', sql.VarChar(100), branch.abrev)
            .input('initials', sql.VarChar(3), branch.initials)
            .query(`update branch set
                    name = @name,
                    abrev = @abrev,
                    initials = @initials
                where id = @id`);
        res.send({ sucess: true });
    }));
    app.post("/api/payment_methods", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const payment_method = req.body.payment_method;
        if (payment_method.id > 0) {
            const result = yield new sql.Request(pool)
                .input('id', sql.Int, payment_method.id)
                .input('name', sql.VarChar(100), payment_method.name)
                .input('order', sql.Int, payment_method.order)
                .query(`update payment_method set
                        name = @name,
                        [order] = @order
                    where id = @id`);
        }
        else {
            const result = yield new sql.Request(pool)
                .input('name', sql.VarChar(100), payment_method.name)
                .input('order', sql.Int, payment_method.order)
                .query(`insert into payment_method (name, [order])
                    values (@name, @order)`);
        }
        res.send({ sucess: true });
    }));
    app.post("/api/acquirers", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const acquirer = req.body.acquirer;
        if (acquirer.id > 0) {
            const result = yield new sql.Request(pool)
                .input('id', sql.Int, acquirer.id)
                .input('name', sql.VarChar(100), acquirer.name)
                .input('order', sql.Int, acquirer.order)
                .query(`update acquirer set
                        name = @name,
                        [order] = @order
                    where id = @id`);
        }
        else {
            const result = yield new sql.Request(pool)
                .input('name', sql.VarChar(100), acquirer.name)
                .input('order', sql.Int, acquirer.order)
                .query(`insert into acquirer (name, [order])
                    values (@name, @order)`);
        }
        res.send({ sucess: true });
    }));
    app.post("/api/product_categories", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const product_category = req.body.product_category;
        if (product_category.id > 0) {
            const result = yield new sql.Request(pool)
                .input('id', sql.Int, product_category.id)
                .input('name', sql.VarChar(100), product_category.name)
                .query(`update product_category set
                        name = @name
                    where id = @id`);
        }
        else {
            const result = yield new sql.Request(pool)
                .input('name', sql.VarChar(100), product_category.name)
                .query(`insert into product_category (name)
                    values (@name)`);
        }
        res.send({ sucess: true });
    }));
    app.post("/api/currencies", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const currency = req.body.currency;
        if (currency.id > 0) {
            const result = yield new sql.Request(pool)
                .input('id', sql.Int, currency.id)
                .input('name', sql.VarChar(100), currency.name)
                .input('symbol', sql.VarChar(3), currency.symbol)
                .query(`update currency set
                        name = @name,
                        [symbol] = @symbol
                    where id = @id`);
        }
        else {
            const result = yield new sql.Request(pool)
                .input('name', sql.VarChar(100), currency.name)
                .input('symbol', sql.VarChar(3), currency.symbol)
                .query(`insert into currency (name, [symbol])
                    values (@name, @symbol)`);
        }
        res.send({ sucess: true });
    }));
    app.post("/api/branch_maps/archive", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('id', sql.Int, req.body.id)
            .query(`update branch_map set
                    active = 0                    
                where id = @id`);
        jobs.update_voucher_site();
        res.send({ sucess: true });
    }));
    app.post("/api/branch_maps", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const week_days = req.body.week_days
            .filter(wk => wk.selected)
            .map((wk) => {
            return wk.week_day;
        })
            .join(",");
        const result = yield new sql.Request(pool)
            .input("id", sql.Int, req.body.id || 0)
            .input("branch_id", sql.Int, req.body.branch_id)
            .input("incident_type_id", sql.Int, req.body.incident_type_id)
            .input("receive_voucher", sql.Bit, req.body.receive_voucher)
            .input("week_days", sql.VarChar(sql.MAX), week_days)
            .input("start_hour", sql.Int, req.body.start_time ? req.body.start_time.hour : 0)
            .input("start_minute", sql.Int, req.body.start_time ? req.body.start_time.minute : 0)
            .input("end_hour", sql.Int, req.body.end_time ? req.body.end_time.hour : 0)
            .input("end_minute", sql.Int, req.body.end_time ? req.body.end_time.minute : 0)
            .input("title", sql.VarChar(200), req.body.title)
            .execute(`SaveBranchMap`);
        jobs.update_voucher_site();
        res.send({ sucess: true });
    }));
    app.post("/api/products", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const product = req.body.product;
        if (product.id > 0) {
            const result = yield new sql.Request(pool)
                .input('id', sql.Int, product.id)
                .input('name', sql.VarChar(100), product.name)
                .input('base_value', sql.Decimal(12, 2), product.base_value)
                .input('association_percentage', sql.Decimal(12, 2), product.association_percentage)
                .input('im_percentage', sql.Decimal(12, 2), product.im_percentage)
                .input('local_percentage', sql.Decimal(12, 2), product.local_percentage)
                .input('association_minimal_value', sql.Decimal(12, 2), product.association_minimal_value)
                .input('im_minimal_value', sql.Decimal(12, 2), product.im_minimal_value)
                .input('local_minimal_value', sql.Decimal(12, 2), product.local_minimal_value)
                .input('currency_id', sql.Int, product.currency_id || 1)
                .input('category_id', sql.Int, product.category_id)
                .query(`update product set
                        name = @name,
                        [association_percentage] = @association_percentage,
                        [im_percentage] = @im_percentage,
                        [local_percentage] = @local_percentage,                        
                        [association_minimal_value] = @association_minimal_value,
                        [im_minimal_value] = @im_minimal_value,
                        [local_minimal_value] = @local_minimal_value,
                        base_value = @base_value,
                        currency_id = @currency_id,
                        category_id = @category_id
                    where id = @id`);
        }
        else {
            const result = yield new sql.Request(pool)
                .input('name', sql.VarChar(100), product.name)
                .input('base_value', sql.Decimal(12, 2), product.base_value)
                .input('association_percentage', sql.Decimal(12, 2), product.association_percentage)
                .input('im_percentage', sql.Decimal(12, 2), product.im_percentage)
                .input('local_percentage', sql.Decimal(12, 2), product.local_percentage)
                .input('association_minimal_value', sql.Decimal(12, 2), product.association_minimal_value)
                .input('im_minimal_value', sql.Decimal(12, 2), product.im_minimal_value)
                .input('local_minimal_value', sql.Decimal(12, 2), product.local_minimal_value)
                .input('currency_id', sql.Int, product.currency_id || 1)
                .input('category_id', sql.Int, product.category_id)
                .query(`insert into product (name, base_value, country_id, [association_percentage], im_percentage, local_percentage, 
                    association_minimal_value, im_minimal_value, local_minimal_value, currency_id, category_id)
                values (@name, @base_value, 1, @association_percentage, @im_percentage, @local_percentage,
                @association_minimal_value, @im_minimal_value, @local_minimal_value, @currency_id, @category_id)`);
        }
        res.send({ sucess: true });
    }));
    app.post("/api/branches_acquirers", security_services_1.SecurityService.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('branch_id', sql.Int, req.body.branch_id)
            .input('acquirer_id', sql.Int, req.body.acquirer_id)
            .execute(`ToggleBranchAcquirerAssociation`);
        res.send({ sucess: true });
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=parameters-routes.js.map