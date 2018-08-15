import { Person } from "app/shared/models/person";
import { InventoryItem } from "app/shared/models/InventoryItem";

export class PersonalInventory {
  id: number;
  person: Person;
  item: InventoryItem;
  description: string;

  request_date: Date;
  requested_by: Person;

  acknowledge_date: Date;
  acknowledge_by: Person;

  delivery_date: Date;
  delivered_by: Person;

  expiration_date: Date;
}
