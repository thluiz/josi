import { Card } from 'app/shared/models/card.model';

export class CardStep {
    id: number;    
    name: string;        
    order: number; 
    childrens: Card[];   
    automatically_move: boolean;
}