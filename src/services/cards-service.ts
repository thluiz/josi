import { DatabaseManager } from './managers/database-manager';
import { Result } from '../helpers/result';

const DBM = new DatabaseManager();

export class CardsService {
    static async check_cards_has_overdue_cards(): Promise<Result<any>> {
        return await DBM.ExecuteSPNoResults("CheckCardsHasOverdueCards");
    }

    static async correct_card_out_of_parent_step() : Promise<Result> {
        return await DBM.ExecuteSPNoResults("CorrectCardOutOfParentStep");
    }
}