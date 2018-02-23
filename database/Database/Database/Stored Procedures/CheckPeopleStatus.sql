CREATE procedure [dbo].[CheckPeopleStatus](@person int = null)                    
as                    
begin                    
                    
 declare @people_financial_status table (person_id int, [status] int)                    
                                
 -- people without scheduled payment                      
 insert into @people_financial_status(person_id, [status])                    
  select p.id, 1                    
  from person p                    
  where p.id = isnull(@person, p.id)                       
   and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_inactive_member = 1)        
   and not exists(select 1 from person_incident pic                     
       join incident i on pic.incident_id = i.id                    
       where pic.person_id = p.id                     
        and i.incident_type = 24                 
		and i.cancelled = 0                   
        and i.date > getdate()                    
       )                     
        
                        
 -- people with old payments not closed and not treated                    
 insert into @people_financial_status(person_id, [status])                    
  select p.Id, 2                    
  from person p                    
  where p.id = isnull(@person, p.id)                    
	and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_inactive_member = 1)        
	and exists(select 1 from person_incident pic                     
       join incident i on pic.incident_id = i.id                    
       where pic.person_id = p.id                     
        and i.incident_type = 24                    
        and i.closed = 0                    
        and i.treated = 0                 
		and i.cancelled = 0                 
        and i.date < getdate()                    
       )                    
                    
 update ps set [status] = 4                    
 from @people_financial_status ps                    
 where exists(select 1 from @people_financial_status ps2 where ps.person_id = ps2.person_id and [status] = 1)                    
   and exists(select 1 from @people_financial_status ps2 where ps.person_id = ps2.person_id and [status] = 2)                    
                    
 update p set financial_status = pfs.[status]                    
 from person p                     
  join @people_financial_status pfs on pfs.person_id = p.id                    
                    
 update p set financial_status = 0                    
 from person p                     
 where not exists(select 1 from @people_financial_status pfs where pfs.person_id = p.id)                   
 and p.id = isnull(@person, p.id)                       
                    
 -- SCHEDULING STATUS                    
                    
 declare @people_scheduling_status table (person_id int, [status] int)                    
                    
 -- people without scheduled formal moment                      
 insert into @people_scheduling_status(person_id, [status])                    
  select p.id, 1                    
  from person p                    
  where p.id = isnull(@person, p.id)     
	and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_inactive_member = 1)                       
	and not exists(select 1 from person_incident pic                     
       join incident i on pic.incident_id = i.id                    
       where pic.person_id = p.id                     
        and i.incident_type = 1                
		and i.cancelled = 0                  
        and i.date > getdate()                    
       )                    
                    
                           
 -- people with absence in old formal moments and not treated                    
 insert into @people_scheduling_status(person_id, [status])                    
  select p.Id, 2                    
  from person p                    
  where p.id = isnull(@person, p.id)
	and (p.is_active_member = 1 or p.is_leaving = 1 or p.is_inactive_member = 1)                            
	and exists(select 1 from person_incident pic                     
       join incident i on pic.incident_id = i.id                    
       where pic.person_id = p.id                     
        and i.incident_type = 1                    
        and i.closed = 0                    
        and i.treated = 0                  
		and i.cancelled = 0                
        and i.date < getdate()                    
       )                                                   
        
 update ps set [status] = 4                  
 from @people_scheduling_status ps                 
 where exists(select 1 from @people_financial_status ps2 where ps.person_id = ps2.person_id and [status] = 1)                    
   and exists(select 1 from @people_financial_status ps2 where ps.person_id = ps2.person_id and [status] = 2)                    
                                        
 update p set scheduling_status = pfs.[status]                    
 from person p                     
  join @people_scheduling_status pfs on pfs.person_id = p.id                    
                                        
 update p set scheduling_status = 0                    
 from person p                     
 where not exists(select 1 from @people_scheduling_status pfs where pfs.person_id = p.id)                    
 and p.id = isnull(@person, p.id)                   
                    
 update p set financial_status = 0                 
 from person p                
 where free_financial = 1                
  and p.Id = isnull(@person, p.id)                
                
 update p set scheduling_status = 0                 
 from person p                
 where free_scheduling = 1                
  and p.Id = isnull(@person, p.id)                
                

  exec GetPersonMissingData @person_id = @person, @save_data = 1        
         
 update p set issues_level = 0        
 from person p        
 where p.Id = isnull(@person, p.id)        
 and (p.scheduling_status = 0 and p.data_status = 0 and p.financial_status = 0)        
 and issues_level != 0        
        
        
 update p set issues_level = 2        
 from person p        
 where p.Id = isnull(@person, p.id)        
 and (p.scheduling_status = 1 or p.data_status = 1 or p.financial_status =1)        
 and issues_level != 2        
      
 update p set p.has_birthday_this_month = 1  
 from person p  
 where DATEPART(MONTH, birth_date) = DATEPART(MONTH, dbo.getCurrentDateTime())  
 and p.Id = isnull(@person, p.id)        
 and p.has_birthday_this_month = 0     
  
 update p set p.has_birthday_this_month = 0  
 from person p  
 where DATEPART(MONTH, birth_date) != DATEPART(MONTH, dbo.getCurrentDateTime())  
 and p.Id = isnull(@person, p.id)        
 and p.has_birthday_this_month = 1     
   
        
end 

