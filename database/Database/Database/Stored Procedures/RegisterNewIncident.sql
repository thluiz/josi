CREATE procedure [dbo].[RegisterNewIncident](                      
 @type int,       
 @people varchar(max),       
 @date datetime, @branch int,                      
 @value decimal(12,2) = null,                      
 @description varchar(max) = null,                    
 @new_people varchar(max) = null,        
 @register_closed bit = 0,        
 @responsible_id int = null,      
 @card_id int = null,      
 @register_treated bit = 0,     
 @start_activity bit = 0    
) as                       
begin                      
              
 declare @incidents table (id int)  
 declare @people_incidents table(person_id int)              
                      
 if(@branch is null)                
 begin                 
  select top 1 @branch = branch_id                 
  from person p                
   join dbo.Split(@people, ',') sp on sp.Item = p.id                  
 end                
                
 if(len(isnull(@people, '')) > 0)                    
 begin                    
  insert into @people_incidents(person_id)                      
  select p.Item              
  from dbo.Split(@people, ',') p                         
 end                    
              
 if(len(isnull(@new_people, '')) > 0)                    
 begin                                      
  select distinct ltrim(rtrim(item)) [name]                    
   into #new_people                    
  from dbo.Split(@new_people, ',')                    
                    
  while(exists(select 1 from #new_people))                    
  begin                    
   declare @name varchar(200) = (select top 1 [name] from #new_people)                    
                    
   insert into person([name], is_interested) values (@name, 1)                           
                        
   declare @new_person int = @@identity                    
    insert into person_role(person_id, role_id) values (@new_person, 4)          
          
   insert into @people_incidents(person_id) values (@new_person)               
                    
   delete from #new_people where [name] = @name                          
  end                    
 end                  
              
 while exists(select 1 from @people_incidents)              
 begin               
  declare @person_incident int = (select top 1 person_id from @people_incidents)              
              
  insert into incident(                      
   responsible_id, incident_type, [date], branch_id, [description], [value],                       
   closed,       
   closed_by,        
   closed_on,         
   scheduled,       
   card_id, treated, started_on                     
  ) values (                      
   @responsible_id, @type, @date, @branch, @description, @value,                      
   case when @register_closed = 1 or @register_treated = 1 then 1 else 0 end,       
   null,         
   case when @register_closed = 1 or @register_treated = 1 then dbo.getCurrentDateTime() end,           
   cast((case when @date < dbo.getCurrentDateTime() then 1 else 0 end) as bit),      
   @card_id, @register_treated,    
   case when @start_activity = 1 then dbo.getCurrentDateTime() else null end                             
  )                      
                       
  declare @incident int = @@identity                      
          
  insert into @incidents(id) values (@incident)  
  
  insert into person_incident(person_id, participation_type, incident_id)                     
   values (@person_incident, 1, @incident)                    
              
  delete from @people_incidents where person_id = @person_incident              
    
 end                                  
  
 select i.*   
 from vwLightIncident i   
  join @incidents ii on ii.id = i.id  
 for json path  
  
end 