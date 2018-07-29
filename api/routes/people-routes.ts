import * as sql from 'mssql';
import { PersonService } from '../../domain/services/person_services';
import * as auth from '../../src/middlewares/auth';
import { SecurityService } from '../../src/services/security-service';
import { JobsService } from '../../src/services/jobs-service';
import { DatabaseManager } from '../../src/services/managers/database-manager';

let DBM = new DatabaseManager();

export function configure_routes(app: any, connection_pool: any) {
    const pool = connection_pool;

    const person_service = new PersonService(pool);

    app.get("/api/people/members",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            const result = await new sql.Request(pool)
                .execute(`GetMembersList`);

            response.send(result.recordset[0]);
        });

    app.get("/api/people",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            const result = await new sql.Request(pool)
                .execute(`GetPeopleList`);

            response.send(result.recordset[0]);
        });

    app.get("/api/people/:id",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            let result = await DBM.ExecuteJsonSP<any[]>("GetPersonData",
                { "id": request.params.id }
            );

            response.send(result.data && (result.data as any[]).length > 0 ?
                result.data[0] : []);
        });

    app.get("/api/people/search/:name?",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            const result = await new sql.Request(pool)
                .input('names', sql.VarChar(sql.MAX), request.params.name)
                .execute(`GetPeopleByNameForTypeahead`);

            response.send(result.recordset[0]);
        });

    app.post("/api/people",
        auth.ensureLoggedIn(),
        async (request, res, next) => {
            try {
                const result = await person_service.update_person_data(
                    request.body.person
                );

                res.send(result.recordset[0][0]);
            } catch (error) {
                res.status(500).json(error);
            }
        });

    app.post("/api/person",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            try {
                const result = await person_service.register_new_person(
                    req.body.person, SecurityService.getUserFromRequest(req)
                );

                res.send(result.recordset[0][0]);
            } catch (error) {
                res.status(500).json(error);
            }
        });

    app.get("/api/invited_people",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            console.log(req.query.voucher);
            const result = await new sql.Request(pool)
                .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
                .input('voucher', sql.Int, req.query.voucher > 0 ? req.query.voucher : null)
                .input('name', sql.VarChar(150), req.query.name)
                .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
                .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
                .execute(`GetInvitedPeople`);

            let response = result.recordset[0];

            res.send(response[0].empty ? [] : response);
        });

    app.get("/api/interested",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            const result = await new sql.Request(pool)
                .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
                .input('name', sql.VarChar(150), req.query.name)
                .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
                .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
                .execute(`GetPeopleInterested`);

            let response = result.recordset[0];

            res.send(response[0].empty ? [] : response);
        });

    app.get("/api/people-away",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            const result = await new sql.Request(pool)
                .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
                .input('name', sql.VarChar(150), req.query.name)
                .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
                .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
                .execute(`GetPeopleAway`);

            let response = result.recordset[0];

            res.send(response[0].empty ? [] : response);
        });

    app.get("/api/service-providers",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            const result = await new sql.Request(pool)
                .input('branch', sql.Int, req.query.branch > 0 ? req.query.branch : null)
                .input('name', sql.VarChar(150), req.query.name)
                .input('people_per_page', sql.Int, req.query.people_per_page > 0 ? req.query.people_per_page : null)
                .input('page', sql.Int, req.query.page > 1 ? req.query.page : 1)
                .execute(`GetPeopleServiceProvider`);

            let response = result.recordset[0];

            res.send(response[0].empty ? [] : response);
        });

    app.get("/api/people/:id",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            const result = await new sql.Request(pool)
                .input('id', sql.Int, request.params.id)
                .execute(`GetPersonData`);

            response.send(result.recordset[0][0]);
        });


    app.get("/api/person_address/:person_id",
        auth.ensureLoggedIn(),
        async (request, res, next) => {
            const result = await new sql.Request(pool)
                .input('person_id', sql.Int, request.params.person_id)
                .execute(`GetPersonAddress`);

            let response = result.recordset[0];

            res.send(response[0].empty ? [] : response);
        });

    app.get("/api/person_communication/pending/:person_id",
        auth.ensureLoggedIn(),
        async (request, res, next) => {
            const result = await new sql.Request(pool)
                .input('person_id', sql.Int, request.params.person_id)
                .execute(`GetPersonPendingCommunication`);

            let response = result.recordset[0];
            res.send(response);
        });

    app.get("/api/person_financial/pending/:person_id",
        auth.ensureLoggedIn(),
        async (request, res, next) => {
            const result = await new sql.Request(pool)
                .input('person_id', sql.Int, request.params.person_id)
                .execute(`GetPersonPendingFinancial`);

            let response = result.recordset[0];
            res.send(response);
        });

    app.get("/api/person_schedule/pending/:person_id",
        auth.ensureLoggedIn(),
        async (request, res, next) => {
            const result = await new sql.Request(pool)
                .input('person_id', sql.Int, request.params.person_id)
                .execute(`GetPersonPendingSchedule`);

            let response = result.recordset[0];
            res.send(response);
        });

    app.post("/api/person_address",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            let result = await person_service.save_address(request.body.address);

            response.send({ sucess: true });
        });

    app.post("/api/person_address/archive",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            let result = await person_service.archive_address(request.body.person_address);

            response.send({ sucess: true });
        })

    /**
     * ROLES
     */

    app.post("/api/person_role/delete",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            let result = await person_service.remove_role(
                request.body.person_id,
                request.body.role_id
            );

            response.send({ sucess: true });
        });

    app.get("/api/person_role",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            const result = await new sql.Request(pool)
                .execute(`GetPeopleList`);

            response.send(result.recordset[0]);
        });


    app.post("/api/person_role",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            let result = await person_service.add_role(
                request.body.person_id,
                request.body.role_id
            );

            response.send({ sucess: true });
        });

    app.get("/api/person_role/person/:id",
        auth.ensureLoggedIn(),
        async (request, res, next) => {
            const result = await new sql.Request(pool)
                .input('person_id', sql.Int, request.params.id)
                .execute(`GetPersonRoles`);

            let response = result.recordset[0];

            res.send(response[0].empty ? [] : response);
        });

    /**
     * ALIAS
     */

    app.post("/api/people_alias/kf_name",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            let result = await person_service.change_kf_name(
                request.body.person_id,
                request.body.kf_name,
                request.body.ideograms
            );

            response.send({ sucess: true });
        });

    /**
     * CONTACTS
    */

    app.post("/api/person_contact/remove",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            let result = await person_service.remove_contact(
                request.body.contact_id,
            );

            response.send({ sucess: true });
        });

    app.post("/api/person_contact",
        auth.ensureLoggedIn(),
        async (request, res, next) => {
            try {
                let result = await person_service.save_contact({
                    person_id: request.body.person_id,
                    contact_type: request.body.contact_type,
                    contact: request.body.contact,
                    details: request.body.details,
                    principal: request.body.principal
                }
                );

                res.send({ sucess: true });
            } catch (error) {
                res.status(500).json(error);
            }
        });

    app.get("/api/person_contact/person/:id/:only_principal?",
        auth.ensureLoggedIn(),
        async (request, res, next) => {
            try {
                const result = await new sql.Request(pool)
                    .input('person_id', sql.Int, request.params.id)
                    .input('only_principal', sql.Int, request.params.only_principal || 0)
                    .execute(`GetPersonContacts`);

                let response = result.recordset[0];
                res.send(response[0].empty ? [] : response);

            } catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        });

    app.get("/api/person/missing_data/:id",
        auth.ensureLoggedIn(),
        async (request, res, next) => {
            try {
                const result = await new sql.Request(pool)
                    .input('person_id', sql.Int, request.params.id)
                    .execute(`GetPersonMissingData`);

                let response = result.recordset[0];
                res.send(response[0].empty ? [] : response);

            } catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        });

    app.get("/api/person/offering",
        auth.ensureLoggedIn(),
        async (request, res, next) => {
            try {
                const result = await new sql.Request(pool)
                    .input('person_id', sql.Int, request.query.person_id)
                    .execute(`GetPersonOfferingAvailable`);

                let response = result.recordset[0];
                res.send(response[0].empty ? [] : response);

            } catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        });

    /**
     * PARTNERSHIP INDICATIONS
     */

    app.get("/api/person_partnerships/person/:id",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            try {
                const result = await new sql.Request(pool)
                    .input("person", sql.Int, req.params.id)
                    .query(`select * from person_partnership
                    where person_id = @person
                    for json path`);

                let response = result.recordset[0];
                res.send(response);

            } catch (error) {
                if (error.code = 'EJSON') {
                    res.send([]);
                } else {
                    console.log(error);
                    res.status(500).json(error);
                }
            }
        });

    app.post("/api/person_partnerships",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            try {
                let partnership = req.body.partnership;
                console.log(partnership)

                const result = await new sql.Request(pool)
                    .input("person_id", sql.Int, partnership.person_id)
                    .input('comments', sql.VarChar(sql.MAX), partnership.comment)
                    .input('name', sql.VarChar(250), partnership.name)
                    .input("branch_id", sql.Int, partnership.branch_id)
                    .input("operator_id", sql.Int, partnership.operator_id)
                    .input("indication_contact_type", sql.Int, partnership.indication_contact_type)
                    .execute(`SaveNewPartnership`);

                res.send({ success: true });
            } catch (error) {
                if (error.code = 'EJSON') {
                    res.send([]);
                } else {
                    console.log(error);
                    res.status(500).json(error);
                }
            }
        });

    /**
     * EXTERNAL UNIT INDICATIONS
     */

    app.get("/api/person_external_units/person/:id",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            try {
                const result = await new sql.Request(pool)
                    .input("person", sql.Int, req.params.id)
                    .query(`select * from person_external_unit
                    where person_id = @person
                    for json path`);

                let response = result.recordset[0];
                res.send(response);

            } catch (error) {
                if (error.code = 'EJSON') {
                    res.send([]);
                } else {
                    console.log(error);
                    res.status(500).json(error);
                }
            }
        });

    app.post("/api/person_external_units",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            try {
                let external_unit = req.body.external_unit;

                const result = await new sql.Request(pool)
                    .input("person_id", sql.Int, external_unit.person_id)
                    .input('comments', sql.VarChar(sql.MAX), external_unit.comment)
                    .input('name', sql.VarChar(250), external_unit.name)
                    .input("branch_id", sql.Int, external_unit.branch_id)
                    .input("operator_id", sql.Int, external_unit.operator_id)
                    .input("indication_contact_type", sql.Int, external_unit.indication_contact_type)
                    .execute(`SaveNewExternalUnit`);

                res.send({ success: true });
            } catch (error) {
                if (error.code = 'EJSON') {
                    res.send([]);
                } else {
                    console.log(error);
                    res.status(500).json(error);
                }
            }
        });

    /**
     * INDICATIONS
     */



    app.get("/api/person_indications/person/:id",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            try {
                const result = await new sql.Request(pool)
                    .input("person", sql.Int, req.params.id)
                    .query(`select * from vwPersonRelationships
                    where relationship_type in (10, 13, 14) and person_id = @person
                    for json path`);

                let response = result.recordset[0];
                res.send(response);

            } catch (error) {
                if (error.code = 'EJSON') {
                    res.send([]);
                } else {
                    console.log(error);
                    res.status(500).json(error);
                }
            }
        });

    app.post("/api/person_indications",
        auth.ensureLoggedIn(),
        async (req, res, next) => {
            try {
                let indication = req.body.indication;

                const result = await new sql.Request(pool)
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
                    .input("age", sql.Int, indication.age > 0 ? indication.age : 0)
                    .input('district', sql.VarChar(100), indication.district)
                    .input('occupation', sql.VarChar(100), indication.occupation)
                    .execute(`SaveNewIndication`);

                try {
                    let voucher_update = await JobsService.update_voucher_site();
                    if (!voucher_update.success) {
                        res.send(voucher_update);
                        return;
                    }
                } catch (error) {
                    console.log(error);
                    res.status(500).json(error);
                    return;
                }

                res.send({ success: true });
            } catch (error) {
                if (error.code = 'EJSON') {
                    console.log(error);
                    res.send([]);
                } else {
                    console.log(error);
                    res.status(500).json(error);
                }
            }
        });

    /**
     * SCHEDULING
     */

    app.post("/api/person_schedule/delete",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            let result = await person_service.remove_schedule(
                request.body.id
            );

            response.send({ sucess: true });
        });

    app.get("/api/person_schedule/person/:id",
        auth.ensureLoggedIn(),
        async (request, res, next) => {
            try {
                let result = await new sql.Request(pool)
                    .input('person_id', sql.Int, request.params.id)
                    .execute(`GetPersonScheduling`);

                let response = result.recordset[0];

                res.send(response[0].empty ? [] : response);
            } catch (error) {
                res.status(500).json(error);
            }
        });

    app.post("/api/person_schedule",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            const user = await SecurityService.getUserFromRequest(request);
            const responsible_id = await user.getPersonId();

            let result = await person_service.save_schedule(
                request.body.schedule, responsible_id
            );

            response.send({ sucess: true });
        });

    /**
     * COMMENTS
     */

    app.get("/api/people_comments/about/:id/:show_archived?",
        auth.ensureLoggedIn(),
        async (request, res, next) => {
            try {
                const result = await new sql.Request(pool)
                    .input('person_id', sql.Int, request.params.id)
                    .input('show_archived', sql.Int, request.params.show_archived || 0)
                    .execute(`GetCommentsAboutPerson`);

                let response = result.recordset[0];
                res.send(response[0].empty ? [] : response);

            } catch (error) {
                console.log(error);
                res.status(500).json(error);
            }
        });

    app.post("/api/people_comments/about",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            const user = await SecurityService.getUserFromRequest(request);
            const responsible_id = await user.getPersonId();

            let result = await person_service.save_comment_about(
                request.body.person_id,
                request.body.comment,
                responsible_id
            );

            response.send(result);
        });

    app.post("/api/people_comments/archive",
        auth.ensureLoggedIn(),
        async (request, response, next) => {
            let result = await person_service.archive_comment(
                request.body.id
            );

            response.send(result);
        });
}