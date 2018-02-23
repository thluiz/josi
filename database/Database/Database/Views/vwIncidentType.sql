CREATE view vwIncidentType      
as      
 select id, [name], abrev, need_description, obrigatory,                       
  need_value, automatically_generated, [order], need_to_be_started,  
  allowed_for_new_person, 
   (select id, [name], it.abrev + ch.abrev abrev, need_description,                                                           
    obrigatory, need_value, parent_id,                       
    it.abrev parent_abrev, automatically_generated , need_to_be_started,
	allowed_for_new_person                                                          
    from enum_incident_type ch                                                          
    where ch.parent_id = it.id                                                          
  and active = 1                  
  order by [order]                                                  
    for json path                                                          
   ) childrens                                                          
   from enum_incident_type it                                                          
   where parent_id is null      
  and active = 1 
