
CREATE view vwCard          
with schemabinding          
as          
select c.id, c.title, c.due_date, left(CONVERT(VARCHAR, c.due_date, 103), 5) due_date_formated, c.created_on,           
 c.leader_id, c.parent_id, c.archived, c.cancelled,           
 c.location_id, c.abrev, c.[order], c.current_step_id,      
 c.card_template_id template_id, ct.is_task,    
 (select l.id, l.name, l.avatar_img from dbo.vwPerson l where l.id = c.leader_id for json path) leaders,  
 (select pc.person_id, p.name, p.avatar_img, p.kf_name_ideograms, p.contacts,  
 pc.[order],                   
 isnull(pc.position_description, pcp.name) position_description,                   
 pc.position,   
 cast((case when               
 exists(select 1               
  from dbo.[card] children               
  join dbo.person_card pc on pc.card_id = children.id              
  where children.parent_id = c.id and person_id = p.id)              
  then 1 else 0 end) as bit) has_tasks           
  from dbo.person_card pc                  
   join dbo.vwPerson p on pc.person_id = p.id                  
   join dbo.person_card_position pcp on pcp.id = pc.position                  
  where pc.card_id = c.id                  
  order by pc.[order]                
  for json path                  
 ) people,   
 (            
  select cs.id, cs.name, cs.is_blocking_step,      
   (      
    select count(1)  
  from dbo.[card]             
     where parent_id = c.id        
  and current_step_id = cs.id        
  and cancelled = 0    
  and archived = 0                              
   ) childrens         
  from dbo.card_step cs             
  where cs.card_id = c.id      
  and archived = 0              
  order by [order]  
  for json path        
 ) steps_description                         
from dbo.[card] c (nolock)       
 join dbo.card_template ct (nolock) on ct.id = c.card_template_id    
  
   