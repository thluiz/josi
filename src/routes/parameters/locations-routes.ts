import { Country } from "./../../entity/Country";
import { Branch } from "./../../entity/Branch";
import { Location } from "./../../entity/Location";
import * as auth from "../../middlewares/auth";
import { DatabaseManager } from "../../services/managers/database-manager";
import { Result, ErrorResult, SuccessResult } from "../../helpers/result";
import { ErrorCode } from "../../helpers/errors-codes";

let DBM = new DatabaseManager();

export function routes(app) {
  app.get("/api/locations", auth.ensureLoggedIn(), async (req, res, next) => {
    try {
      const LR = await DBM.getRepository<Location>(Location);
      let query = await LR.createQueryBuilder("l")
        .innerJoinAndSelect("l.country", "c")
        .leftJoinAndSelect("l.branch", "b")
        .orderBy("l.active desc, l.order");

      if(req.query.active) {
        query = query.where("l.active = :0", req.query.active);
      }

      let result = await query.getMany();

      res.send(SuccessResult.GeneralOk(result));
    } catch (error) {
      res.status(500).json(ErrorResult.Fail(ErrorCode.GenericError, error));
    }
  });

  app.post("/api/locations", auth.ensureLoggedIn(), async (req, res) => {
    try {
      const LR = await DBM.getRepository<Location>(Location);
      let loc = req.body.location;
      let location = loc.id > 0 ? await LR.findOne(loc.id) : new Location();

      if (loc.branch && loc.branch.id > 0) {
        const BR = await DBM.getRepository<Branch>(Branch);
        location.branch = await BR.findOne(loc.branch.id);
      }

      if (loc.country && loc.country.id > 0) {
        const CR = await DBM.getRepository<Country>(Country);
        location.country = await CR.findOne(loc.country.id);
      }

      location.active = loc.active;
      location.description = loc.description;
      location.name = loc.name;
      location.order = loc.order;

      let result = await LR.save(location);

      res.send(SuccessResult.GeneralOk(result));
    } catch (error) {
      res.status(500).json(ErrorResult.Fail(ErrorCode.GenericError, error));
    }
  });
}
