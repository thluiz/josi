
                      
CREATE view [dbo].[vwIncident]              
with schemabinding                      
as                        
 select i.id, LEFT(CONVERT(VARCHAR(15), i.[date], 103), 5) small_date,                                                                                               
  cast(i.[date] as date) date,                                                                    
  i.[date] full_date,                                                                                          
  convert(char(5), i.[date], 108) start_hour,                                                                                          
  convert(char(10), i.[started_on], 103) started_on_date,                                                                                          
  convert(char(5), i.[started_on], 108) started_on_hour,                                                                                          
  convert(char(10), i.[closed_on], 103) closed_on_date,                                                                                          
  convert(char(5), i.[closed_on], 108) closed_on_hour,                    
  i.closed, i.closed_on, i.treated, isnull(parent_eit.abrev, '') + eit.abrev abrev,                   
  isnull(pa.alias, p.name) [person], pic.person_id, i.[description] title, eit.id [type],                                                                                         
  i.[value],                                                                                          
   case when eit.show_hour_in_diary = 1  then                                           
  convert(char(5), i.[date], 108)                                                                                        
    when i.incident_type = 3 then cast(i.fund_value as varchar(10))                                                                                         
    else  ''                         
   end short_description,                                                                                        
   case when i.incident_type = 2 then i.[description] else isnull(parent_eit.abrev, '') + eit.[Abrev] end                                                                                        
   + ' - ' + isnull(pa.alias, p.name) + ' - ' + LEFT(CONVERT(VARCHAR(15), i.[date], 103), 5) + ' '                                                                                         
   + case when i.incident_type in (1) or i.incident_type >= 10 and i.incident_type <= 22 then                                                                     
  convert(char(5), i.[date], 108)                                                                                        
    when i.incident_type = 3 then cast(i.fund_value as varchar(10))                                                                                         
    when i.incident_type in (4, 24) then ': ' + cast(i.value as varchar(10))                                                  
    else ''                                                                                        
   end long_description,                                                                                          
   cast((case when i.[date] < dbo.getCurrentDateTime() then 1 else 0 end) as bit) past,                                                                     
   it.[description] treatment_text,                                              
   LEFT(CONVERT(VARCHAR(15), new_schedule.[date], 103), 5) new_schedule_small_date,                                                                              
   cast(new_schedule.[date] as date) new_schedule_date,                                                                                          
   convert(char(5), new_schedule.[date], 108) new_schedule_hour,                                                         
   eit.obrigatory, eit.need_description_for_closing,                     
   eit.need_to_be_started, i.close_text, i.cancelled, i.branch_id, b.initials branch_initials,                
   eit.need_start_hour_minute, p.admission_date, i.updated_at,      
   i.comment_count,    
   task.id card_id, isnull(task.title, parent_task.title) card_title,   
   parent_task.title card_parent,  parent_task.id card_parent_id,  
   (select COUNT(1) from dbo.card_commentary cc (nolock) where cc.card_id = task.id) card_comment_count,
   eit.financial_type, case when eit.financial_type = 1 then i.[value] else -i.[value] end final_value
  from dbo.incident i    (nolock)                                       
   join dbo.person_incident pic (nolock) on pic.incident_id = i.id                
   join dbo.person p (nolock) on p.id = pic.person_id                 
   join dbo.branch b (nolock) on b.id = i.branch_id                                      
   join dbo.enum_incident_type eit (nolock) on eit.id = i.incident_type                      
   left join dbo.enum_incident_type parent_eit (nolock) on parent_eit.id = eit.parent_id                           
   left join dbo.person_alias pa (nolock) on pa.person_id = p.id and pa.principal = 1                                                                               
   left join dbo.incident_treatment it (nolock) on it.incident_id = i.id                                                                
   left join dbo.incident new_schedule (nolock) on it.new_incident_id = new_schedule.id    
   left join dbo.card (nolock) task on task.id = i.card_id    
   left join dbo.card (nolock) parent_task on parent_task.id = task.parent_id 