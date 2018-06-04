import { filter } from 'rxjs/operators';
import { Voucher } from './../entity/Voucher';
import { PersonCardPosition } from './../entity/PersonCardPosition';
import { PersonCard } from './../entity/PersonCard';
import { QueryRunner } from 'typeorm';
import { JobsService } from './jobs-service';
import { Location } from './../entity/Location';
import { BranchCategory } from './../entity/BranchCategory';
import { DatabaseFacility } from './../facilities/database-facility';
import { Result } from "../helpers/result";
import { Branch } from "../entity/Branch";
import { trylog } from "../decorators/trylog-decorator";
import { firebaseEmitter } from "../decorators/firebase-emitter-decorator";
import { ErrorCode } from '../helpers/errors-codes';
import { Country } from '../entity/Country';
import { Card } from '../entity/Card';
import { Person } from '../entity/Person';

const PARAMETERS_COLLECTION = "parameters-events";
const BRANCH_CREATED = "BRANCH_CREATED";
const BRANCH_UPDATED = "BRANCH_UPDATED";
const BRANCH_CATEGORY_GI = 1;
const VOUCHER_CREATED = "VOUCHER_CREATED";
const VOUCHER_UPDATED = "VOUCHER_UPDATED";
const BRANCHVOUCHER_CREATED = "BRANCH_VOUCHER_CREATED";
const BRANCHVOUCHER_REMOVED = "BRANCH_VOUCHER_REMOVED";
const NOTHING_CHANGED = "NOTHING_CHANGED";

export interface IBranchData {
    abrev : string, 
    name: string, 
    initials: string, 
    category_id : number,
    country_id : number, 
    director_id: number,
    associate_director_id: number,
    order:number
}

export class ParametersService {

    @trylog()
    @firebaseEmitter(PARAMETERS_COLLECTION)
    static async save_voucher(voucher_data : Voucher ) : Promise<Result<Voucher>> {
        const VR = await DatabaseFacility.getRepository(Voucher);             

        return Result.Ok(voucher_data.id > 0 ? VOUCHER_UPDATED : VOUCHER_CREATED, 
            await VR.save(voucher_data)
        );
    }

    @trylog()
    @firebaseEmitter(PARAMETERS_COLLECTION)
    static async create_branch_voucher(branch : Branch, voucher : Voucher ) : Promise<Result<{branch: Branch, voucher: Voucher}>> {
        const VR = await DatabaseFacility.getRepository<Voucher>(Voucher);             

        voucher = await VR.findOne(voucher.id, { relations: ["branch"] }); //load relation

        if(voucher.branches.find(b => b.id == branch.id)) {
            return Result.Fail(ErrorCode.NothingChanged, null);
        }

        voucher.branches.push(branch);
        await VR.save(voucher);

        return Result.Ok(BRANCHVOUCHER_CREATED, {
            branch, voucher
        })
    }

    @trylog()
    @firebaseEmitter(PARAMETERS_COLLECTION)
    static async remove_branch_voucher(branch : Branch, voucher : Voucher ) : Promise<Result<{branch: Branch, voucher: Voucher}>> {
        const VR = await DatabaseFacility.getRepository<Voucher>(Voucher);             

        voucher = await VR.findOne(voucher.id, { relations: ["branch"] }); //load relation

        if(!voucher.branches.find(b => b.id == branch.id)) {
            return Result.Fail(ErrorCode.NothingChanged, null);
        }

        voucher.branches = voucher.branches.filter(b => b.id != branch.id);
        await VR.save(voucher);            
        
        return Result.Ok(BRANCHVOUCHER_REMOVED, {
            branch, voucher
        })
    }

    @trylog()
    @firebaseEmitter(PARAMETERS_COLLECTION)
    static async update_branch(branch : Branch) : Promise<Result<Branch>> {
        const BR = await DatabaseFacility.getRepository<Branch>(Branch);     
        return Result.Ok(BRANCH_UPDATED, await BR.save(branch));
    }

    @trylog()
    @firebaseEmitter(PARAMETERS_COLLECTION)
    static async create_branch(branch_data : IBranchData) : Promise<Result<Branch>> {
        return await DatabaseFacility.ExecuteWithinTransaction(async (qr) => {            
            const BR = qr.manager.getRepository(Branch);                
            const BCR = qr.manager.getRepository(BranchCategory);

            let location = await this.create_location(qr, branch_data);

            let branch = new Branch();
            branch.abrev = branch_data.abrev;
            branch.active = true;
            branch.category = await BCR.findOne(branch_data.category_id); 
            branch.has_voucher = false;
            branch.initials = branch_data.initials;
            branch.name = branch_data.name;
            branch.location = location;
            branch.order = branch_data.order;     
            
            branch = await BR.save(branch);                    

            if(branch_data.category_id == BRANCH_CATEGORY_GI) {
                const PR = qr.manager.getRepository(Person);
                let director = await PR.findOne(branch_data.director_id);
                let second_director = await PR.findOne(branch_data.associate_director_id);
                
                await this.create_organization(qr, branch, location, director, second_director);
            }
                            
            return Result.Ok<Branch>(BRANCH_CREATED, branch);                
        });

    }

    private static async create_organization(qr: QueryRunner, branch: Branch, 
        location: Location, director : Person, associate_director: Person) {
        const CR = qr.manager.getRepository(Card);
        const PCR = qr.manager.getRepository(PersonCard);
        const PCPR = qr.manager.getRepository(PersonCardPosition);
        const director_position = await PCPR.findOne(1);

        let organization = new Card();
        organization.archived = false;
        organization.cancelled = false;
        organization.abrev = branch.abrev;
        organization.automatically_generated = true;
        organization.title = branch.name;
        organization.location = location;
        organization.leader = director;
        organization.card_template_id = 6;

        organization = await CR.save(organization);

        let dir = new PersonCard();    
        dir.person = director;
        dir.position = director_position;
        dir.position_description = "Diretor";
        dir.card = organization;
        await PCR.save(dir);
        
        let dir_adj = new PersonCard();    
        dir_adj.person = associate_director;
        dir_adj.position = director_position;
        dir_adj.position_description = "Diretor Adjunto";
        dir_adj.card = organization;

        await PCR.save(dir_adj);

        return organization;
    }

    private static async create_location(qr: QueryRunner, branch_data: IBranchData) {
        const CR = qr.manager.getRepository(Country);
        const LR = qr.manager.getRepository(Location);
        
        let location = new Location();
        location.name = branch_data.name;
        location.country = await CR.findOne(branch_data.country_id);
        location.active = true;
        location.order = 0;
        location = await LR.save(location);
        return location;
    }
}