import { Card } from 'app/shared/models/card.model';

export class CardStep {
    public id: number;    
    public name: string;        
    public order: number; 
    public childrens: Card[];    
}