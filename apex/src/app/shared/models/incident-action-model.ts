import { IncidentActionIncidentData } from "app/shared/models/incident-action-incident-data.model";

export class IncidentAction {
  id: number;
  incident_action_configuration_id: number;
  location_id: number;

  incident_action_type: number;
  incident_action_type_name: string;

  title: string;
  description:string;

  original_incident_action_id: number;

  created_at: string;
  created_by: number;
  created_by_name: string;

  completed: boolean;
  completed_by: number;
  completed_at: string;
  completed_by_name: string;

  treated: boolean;
  treated_by: number;
  treated_at: string;
  treated_by_name: string;

  cancelled: boolean;

  incidents: IncidentActionIncidentData[];

  comments: {
    id: number,
    created_by_name: string,
    created_at: string,
    comment: string,
    archived: boolean
  }[]
}
