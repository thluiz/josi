import { PersonRelationship } from './../entity/PersonRelationship';
import { DatabaseParameterFacility } from './../facilities/database-parameter-facility';
import { DatabaseFacility } from './../facilities/database-facility';
import { Result } from '../helpers/result';
import { ErrorCode } from '../helpers/errors-codes';

export class InvitationsService {
    static async change_invite_type(invite_id: number, new_type: number): Promise<Result> {
        const conn = await DatabaseFacility.getConnection();
        const queryRunner = conn.createQueryRunner(); 

        try {            
            await queryRunner.startTransaction();

            const invite = await queryRunner.manager.findOne(PersonRelationship, {id: invite_id});            
            invite.relationship_type.id = new_type == 0 ? 13 : new_type == 1 ? 10 : 14;                        
            await queryRunner.manager.save(invite);
            

            await queryRunner.commitTransaction();

            return Result.Ok();
        } catch (error) {
            await queryRunner.rollbackTransaction();

            return Result.Fail(ErrorCode.GenericError, error);
        }                        
    }
}