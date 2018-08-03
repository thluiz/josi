import { DatabaseManager } from './managers/database-manager';
import { Result } from '../helpers/result';

const DBM = new DatabaseManager();

export class CardsService {
    static async correct_card_out_of_parent_step() : Promise<Result> {
        return await DBM.ExecuteSPNoResults("CorrectCardOutOfParentStep");
    }
}