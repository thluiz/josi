CREATE procedure RegisterContactForIncident(@id int, @contact varchar(max))      
as      
begin       
 declare @person int      
      
 update incident set treated = 1 where id = @id         
      
 if(exists(select 1 from incident_treatment where incident_id = @id)) 
	return 

 insert into incident_treatment(person_id, treatment_type, [description], incident_id)    
 values (    
  11, 2, @contact, @id   
 )   
    
 select @person = pic.person_id    
 from incident i    
  join  person_incident pic on pic.incident_id = i.id    
 where i.id = @id         
    
 exec CheckPeopleStatus @person      
      
end