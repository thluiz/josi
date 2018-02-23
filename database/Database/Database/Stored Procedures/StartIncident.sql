CREATE procedure StartIncident(  
 @incident int,  
 @started_by int = null  
)  
as   
begin  
  
 update incident set started_on = dbo.getCurrentDateTime(), 
	started_by = @started_by 
 where id = @incident  
  
end