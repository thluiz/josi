CREATE procedure [dbo].[ReopenIncident](@id int)        
as        
begin         	  
	update i set i.closed = 0,         
		i.closed_on = null
	from incident i      
	where id = @id        
        
end    