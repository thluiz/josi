    
CREATE procedure RemoveIncident(@id int)    
as     
begin     
 select person_id    
 into #person    
 from person_incident pic    
 where incident_id = @id    

 update i set i.cancelled = 1, i.cancelled_on = dbo.getCurrentDateTime()
 from incident i where id = @id    
     
 while(exists(select 1 from #person))    
 begin    
  declare @person_id int = (select top 1 person_id from #person)    
    
  exec CheckPeopleStatus @person_id   
    
  delete from  #person where person_id = @person_id  
 end     
     
 drop table #person  
  
end