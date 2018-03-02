import { Group } from './group.model';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CardStep } from './card-step.model';
import { Location } from './location.model';

export class Card {
    id: number;
    template: { id: number, name: string, is_task: boolean, require_target: boolean, require_target_group: boolean };
    template_id: number;
    title: string;    
    parent: Card;
    parent_id: number;
    parent_title: string;
    high_level_id: number;
    high_level_title: string;
    due_date: NgbDateStruct;
    due_date_formated: string;
    abrev: string;
    order: number;
    leaders: any[];
    people: any[];
    location: Location;
    description: string;
    childrens: Card[];     
    steps: CardStep[]; 
    is_task: boolean; 
    steps_description: { id: number, name: string, is_blocking_step : boolean, childrens: number }
    tmp_person: any;
    is_subproject: boolean;
    group: Group;
    branch: { id: number, name: string }
    comment_count: number;
    archived: boolean;
}