import { QueryRunner } from 'typeorm';
import { EnumRelationshipType } from '../entity/EnumRelationshipType';
import { PersonRelationship } from '../entity/PersonRelationship';
import { DatabaseFacility } from '../facilities/database-facility';
import { Result } from '../helpers/result';

export class InvitationsService {
    static DBF = DatabaseFacility;

    static async change_invite_type(invite_id: number, new_type: number): Promise<Result<any>> {
        return this.DBF.ExecuteWithinTransaction(async (qr : QueryRunner) => {
            const invite = await qr.manager.findOne(PersonRelationship, {id: invite_id});
            let relationship_type = new_type == 0 ? 13 : new_type == 1 ? 10 : 14;

            invite.relationship_type = await qr.manager.findOne(EnumRelationshipType, {id: relationship_type});
            await qr.manager.save(invite);

            return Result.GeneralOk();
        });
    }
}