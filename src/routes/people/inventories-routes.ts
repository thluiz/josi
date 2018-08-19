import * as auth from "../../middlewares/auth";

import { InventoriesRepository } from "../../repositories/inventories-repository";
import { InventoriesService } from "../../services/inventories-service";
import { SecurityService } from "../../services/security-service";
import { DatabaseManager } from "../../services/managers/database-manager";
import { DependencyManager } from "../../services/managers/dependency-manager";
import { InventoryItem } from "../../entity/InventoryItem";

export function routes(app) {
    const IvS = new InventoriesService();
    const IvR = new InventoriesRepository();
    const SS = new SecurityService();

    app.get(
        "/api/inventory_items",
        auth.ensureLoggedIn(),
        async (req, res) => {
          res.send(IvR.getAll());
        }
      );
}
