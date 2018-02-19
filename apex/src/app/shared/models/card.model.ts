import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { CardStep } from './card-step.model';
import { Location } from './location.model';

export class Card {
    public id: number;
    public template_id: number;
    public title: string;    
    public parent: Card;
    public parent_id: number;
    public due_date: NgbDateStruct;
    public abrev: string;
    public order: number;
    public leaders: any[];
    public people: any[];
    public location: Location;
    public description: string;
    public childrens: Card[];     
    public steps: CardStep[]; 
    public is_task: boolean; 
}