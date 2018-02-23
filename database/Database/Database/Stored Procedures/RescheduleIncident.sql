CREATE procedure [dbo].[RescheduleIncident](@id int, @new_date varchar(16), @contact varchar(max) = null)        
as        
begin         
 declare @person int     
        
 update incident set treated = 1 where id = @id
 
 if(exists(select 1 from incident_treatment where incident_id = @id)) 
	return         
        
 insert into incident(responsible_id, incident_type, date, closed, branch_id, [description], 
					[value], fund_value, person_schedule_id)        
  select responsible_id, incident_type, cast(@new_date as datetime), closed, branch_id, 
			[description], [value], fund_value,
			person_schedule_id
  from incident        
  where id = @id    
      
 declare @new_incident_id int = @@IDENTITY    
    
 select @person = pic.person_id      
  from incident i      
   join  person_incident pic on pic.incident_id = i.id      
  where i.id = @id      
    
 insert into person_incident(person_id, incident_id, participation_type) values (    
  @person, @new_incident_id, 1    
 )    
      
        
 insert into incident_treatment(person_id, treatment_type, incident_id, new_incident_id, [description])      
 values (      
  11, 1, @id, @new_incident_id, @contact  
 )        
        
 exec CheckPeopleStatus @person        
        
end    
    