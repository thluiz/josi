import { DatabaseFacility } from './../facilities/database-facility';
import { Result } from '../helpers/result';
export class CardsService {
    static async check_cards_has_overdue_cards(): Promise<Result> {        
        return await DatabaseFacility.ExecuteSPNoResults("CheckCardsHasOverdueCards");        
    }

    static async correct_card_out_of_parent_step() : Promise<Result> {        
        return await DatabaseFacility.ExecuteSPNoResults("CorrectCardOutOfParentStep");                
    }  
}