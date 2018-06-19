CREATE view vwLightIncident      
with schemabinding      
as      
select i.id, i.branch_id, i.cancelled, i.card_id, i.closed, i.comment_count,     
	i.started_on, i.date, i.treated, i.incident_type, i.title,       
	cast(case when i.date < dbo.getCurrentDateTime() then 1 else  0 end as bit) past,      
	isnull(parent_type.abrev, '') + eit.abrev abrev, eit.show_hour_in_diary,    
	eit.need_start_hour_minute, eit.need_to_be_started, eit.activity_type, eit.financial_type,    
	eit.need_description,  eit.need_description_for_closing, eit.need_value, eit.obrigatory,     
	b.initials branch_initials,          
	p.id person_id, p.name person,       
	p.comunication_status, p.data_status, p.financial_status, p.scheduling_status,      
	p.comunication_description, p.data_status_description, p.financial_description, p.scheduling_description	
from dbo.incident i (nolock)                    
 join dbo.enum_incident_type eit (nolock) on eit.id = i.incident_type         
 join dbo.person_incident pic (nolock) on pic.incident_id = i.id      
 join dbo.person p (nolock) on p.id = pic.person_id      
 join dbo.branch b (nolock) on b.id = i.branch_id      
 left join dbo.enum_incident_type parent_type (nolock) on parent_type.id = eit.parent_id