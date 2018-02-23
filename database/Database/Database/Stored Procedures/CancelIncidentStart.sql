CREATE procedure CancelIncidentStart(    
 @incident int  
)    
as     
begin    
    
 update incident set started_on = null,   
 started_by = null   
 where id = @incident    
    
end

