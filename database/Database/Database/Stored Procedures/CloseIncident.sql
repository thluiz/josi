CREATE procedure [dbo].[CloseIncident](@id int, @close_description varchar(max) = null)      
as      
begin       
	declare @person int, @type int
      
	select @person = pic.person_id, @type = i.incident_type       
	from incident i      
		join  person_incident pic on pic.incident_id = i.id      
	where i.id = @id


	update i set i.closed = 1,     
		i.[close_text] = isnull(@close_description, ''),
		i.closed_on = dbo.getCurrentDateTime()   
	from incident i    
	where id = @id      
       	   
	if(@type in (1, 29))
	begin
		update person set person.scheduling_status = 0 
			where id = @person		

	end
	else if(@type = 24)
	begin
		update person set person.financial_status = 0 
			where id = @person		
	end
	
	update i set i.closed = 1 
		from incident i     
			join person_incident pic on pic.incident_id = i.id     
		where i.incident_type = @type    
			and i.treated = 1      
			and i.closed = 0
			and pic.person_id = @person	
           
	exec CheckPeopleStatus @person      
      
end  
  