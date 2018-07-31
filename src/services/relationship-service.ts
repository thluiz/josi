import { PersonRelationship } from '../entity/PersonRelationship';
import { DatabaseManager } from './managers/database-manager';
import { Result, SuccessResult, ErrorResult } from '../helpers/result';
import { ErrorCode } from '../helpers/errors-codes';

const DBM = new DatabaseManager();

export class RelationshipService {
    static async load_person_relationship(person_id: number, include_indications = false): Promise<Result<PersonRelationship[]>> {
        try {
            const PR = await DBM.getRepository<PersonRelationship>(PersonRelationship);
            const exclude_indications = include_indications ? ""
                                    : "and (person2_id = :id or (person_id != :id and relationship_type not in (10,13,14)))";

            let entities = await PR
                            .createQueryBuilder("pr")
                            .innerJoinAndSelect("pr.relationship_type", "rt")
                            .innerJoinAndSelect("pr.parent_person", "parent_person")
                            .innerJoinAndSelect("pr.target_person", "target_person")
                            .where(`(pr.person_id = :id or pr.person2_id = :id) ${exclude_indications}`, { id: person_id })
                            .getMany();

            return SuccessResult.GeneralOk(entities);
        } catch (error) {
            return ErrorResult.Fail(ErrorCode.GenericError, error);
        }
    }
}