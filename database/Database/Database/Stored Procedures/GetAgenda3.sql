                                                                
CREATE procedure [dbo].[GetAgenda3](          
 @branch_id int = null,       
 @location_it int  = null,                                                                           
 @date date = null           
)                                                                                                  
as                                                                                                  
begin                      
 -- declare @branch_id int, @display_modifier int = 0                 
                                      
 if(@date is null)                    
  set @date = cast(getUTCdate() as date)      
        
  select                                     
    (select * from vwLightIncident l
    where l.id in (select i.id 
                from incident i (nolock)       
                join person_incident pic (nolock) on pic.incident_id = i.id       
                join person p (nolock) on p.id = pic.person_id      
                 where incident_type = 36      
                    and cancelled = 0           
                    and cast(date as date) = @date    
                    and isnull(i.branch_id, -1) = isnull(@branch_id, isnull(i.branch_id, -1))
                )      
 order by l.closed, isnull(l.started_on, l.date)    
 for json path) ownerships,             
 (select *      
 from vwLightIncident       
 where id in (      
     select i2.id       
     from incident i2 (nolock)      
     where i2.incident_type != 36      
        and i2.cancelled = 0           
        and isnull(i2.branch_id, -1) = isnull(@branch_id, isnull(i2.branch_id, -1))    
        and cast(date as date) = @date)      
  for json path      
 ) incidents        
 for json path                 
                        
      
end