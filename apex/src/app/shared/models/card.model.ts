import { Group } from './group.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CardStep } from './card-step.model';
import { Location } from './location.model';

export class Card {
    public id: number;
    public template: { id: number, name: string, is_task: boolean, require_target: boolean, require_target_group: boolean };
    public title: string;    
    public parent: Card;
    public parent_id: number;
    public due_date: NgbDateStruct;
    public due_date_formated: string;
    public abrev: string;
    public order: number;
    public leaders: any[];
    public people: any[];
    public location: Location;
    public description: string;
    public childrens: Card[];     
    public steps: CardStep[]; 
    public is_task: boolean; 
    public steps_description: { id: number, name: string, is_blocking_step : boolean, childrens: number }
    public tmp_person: any;
    public is_subproject: boolean;
    public group: Group;
    public branch: { id: number, name: string }
}