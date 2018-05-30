import { PersonRelationship } from './../entity/PersonRelationship';
import { DatabaseParameterFacility } from './../facilities/database-parameter-facility';
import { DatabaseFacility } from './../facilities/database-facility';
import { Result } from '../helpers/result';
import { ErrorCode } from '../helpers/errors-codes';
import { Not, In } from 'typeorm';

export class RelationshipService {
    static async load_person_relationship(person_id: number, include_indications = false): Promise<Result<PersonRelationship[]>> {
        try {
            const PR = await DatabaseFacility.getRepository<PersonRelationship>(PersonRelationship);
            const exclude_indications = include_indications ? "" 
                                    : "and (person2_id = :id or (person_id != :id and relationship_type not in (10,13,14)))";
    
            let entities = await PR
                            .createQueryBuilder("pr")
                            .innerJoinAndSelect("pr.relationship_type", "rt")                            
                            .innerJoinAndSelect("pr.parent_person", "parent_person")
                            .innerJoinAndSelect("pr.target_person", "target_person")
                            .where(`(pr.person_id = :id or pr.person2_id = :id) ${exclude_indications}`, { id: person_id })
                            .getMany();        

            console.log(entities);

            return Result.GeneralOk(entities);
        } catch (error) {
            return Result.Fail(ErrorCode.GenericError, error);   
        }
    }
}