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
const auth = require("../../src/middlewares/auth");
const jobs_service_1 = require("../../src/services/jobs-service");
function configure_routes(app, connection_pool) {
    const pool = connection_pool;
    app.get("/api/branch_maps/branch/:id", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input("branch_id", sql.Int, req.params.id)
            .execute(`GetBranchMap`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/branch_products/branch/:id", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input("branch_id", sql.Int, req.params.id)
            .execute(`GetBranchProducts`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/domains", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetDomains`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/programs", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetPrograms`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/configurations", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.get("/api/products", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        try {
            const result = yield new sql.Request(pool)
                .query(`select * from [vwProduct] where archived = 0 for json path`);
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
    app.get("/api/product_categories", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.get("/api/countries", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from [country] order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/kf_families", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetKungFuFamilies`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/recurrence_types", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetRecurrenceTypes`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/relationship_types", auth.ensureLoggedIn(), (request, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from [enum_relationship_type]
                where active = 1
                for json path`);
        res.send(result.recordset[0]);
    }));
    app.get("/api/incident_types", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetIncidentTypes`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/contact_types", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetContactTypes`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/roles", auth.ensureLoggedIn(), (request, response, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .execute(`GetRoles`);
        response.send(result.recordset[0]);
    }));
    app.get("/api/groups", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from [group] where active = 1 order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/locations", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from [location] where active = 1 order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/payment_methods", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from payment_method where active = 1 order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/acquirers", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from acquirer where active = 1 order by [order] for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    app.get("/api/currencies", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .query(`select * from currency for json path`);
        let response = result.recordset[0];
        res.send(response[0].empty ? [] : response);
    }));
    /**
     * UPDATES
     */
    app.post("/api/branches", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const branch = req.body.branch;
        const result = yield new sql.Request(pool)
            .input('id', sql.Int, branch.id)
            .input('name', sql.VarChar(100), branch.name)
            .input('abrev', sql.VarChar(100), branch.abrev)
            .input('initials', sql.VarChar(3), branch.initials)
            .input('contact_phone', sql.VarChar(200), branch.contact_phone)
            .input('contact_email', sql.VarChar(200), branch.contact_email)
            .input('order', sql.Int, branch.order)
            .input('active', sql.Int, branch.active ? 1 : 0)
            .input('default_currency_id', sql.Int, branch.default_currency_id)
            .input('timezone_id', sql.Int, branch.timezone_id)
            .query(`update branch set
                    name = @name,
                    abrev = @abrev,
                    initials = @initials,
                    [order] = @order,
                    contact_phone = @contact_phone,
                    contact_email = @contact_email,
                    active = @active,
                    timezone_id = @timezone_id,
                    default_currency_id = @default_currency_id
                where id = @id`);
        res.send({ sucess: true });
    }));
    app.post("/api/payment_methods", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.post("/api/acquirers", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.post("/api/product_categories", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.post("/api/currencies", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.post("/api/branch_maps/archive", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('id', sql.Int, req.body.id)
            .query(`update branch_map set
                    active = 0
                where id = @id`);
        let result_site_update = yield jobs_service_1.JobsService.update_voucher_site();
        res.send(result_site_update);
    }));
    app.post("/api/branch_products/:id", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input("id", sql.Int, req.body.id)
            .input("branch_id", sql.Int, req.params.id)
            .input("currency_id", sql.Int, req.body.currency_id)
            .input("category_id", sql.Int, req.body.category_id)
            .input("name", sql.VarChar(250), req.body.name)
            .input("base_value", sql.Decimal(12, 2), req.body.base_value)
            .execute(`SaveBranchProduct`);
        res.send({ sucess: true });
    }));
    app.post("/api/branch_products/archive/:branch_id", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('id', sql.Int, req.body.product.id)
            .query(`update branch_product set
                    archived = 1
                where id = @id`);
        res.send({ sucess: true });
    }));
    app.post("/api/branch_products", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input("branch_id", sql.Int, req.body.branch_id)
            .input("product_id", sql.Int, req.body.product_id)
            .input("base_value", sql.Decimal(12, 2), req.body.base_value)
            .execute(`AssociateBranchProduct`);
        res.send({ sucess: true });
    }));
    app.post("/api/branch_maps", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
        let result_site_update = yield jobs_service_1.JobsService.update_voucher_site();
        res.send(result_site_update);
    }));
    app.post("/api/products/archive", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const product = req.body.product;
        const result = yield new sql.Request(pool)
            .input('id', sql.Int, product.id)
            .query(`update product set
            archived = 1
        where id = @id`);
        res.send({ sucess: true });
    }));
    app.post("/api/products", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
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
    app.post("/api/branches_acquirers", auth.ensureLoggedIn(), (req, res, next) => __awaiter(this, void 0, void 0, function* () {
        const result = yield new sql.Request(pool)
            .input('branch_id', sql.Int, req.body.branch_id)
            .input('acquirer_id', sql.Int, req.body.acquirer_id)
            .execute(`ToggleBranchAcquirerAssociation`);
        res.send({ sucess: true });
    }));
}
exports.configure_routes = configure_routes;
//# sourceMappingURL=parameters-routes.js.map