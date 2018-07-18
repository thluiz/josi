CREATE procedure [dbo].[RegisterNewIncident](                            
 @type int,             
 @people varchar(max),             
 @date datetime,   
 @branch int,                            
 @value decimal(12,2) = null,                            
 @description varchar(max) = null,                          
 @new_people varchar(max) = null,              
 @register_closed bit = 0,              
 @responsible_id int = null,            
 @card_id int = null,            
 @register_treated bit = 0,           
 @start_activity bit = 0,    
 @title varchar(400) = null,
 @add_to_ownernership bit = null,
 @new_owner_id int = null,
 @new_support_id  int = null,
 @ownership_id int = null
) as                             
begin                            
                    
 declare @incidents table (id int)        
 declare @people_incidents table(person_id int)                    
 declare @need_fund_value bit = 0, @financial_type bit = 0  
  
 select @need_fund_value = need_fund_value, @financial_type = financial_type   
 from enum_incident_type eit where eit.id = @type  
                            
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
 
 if(@add_to_ownernership = 1 and @new_owner_id > 0)
 begin 
	insert into incident(                            
		responsible_id, incident_type, [date], branch_id, [description], [value], title,    
		closed,             
		closed_by,              
		closed_on,     
		scheduled,             
		card_id, treated,     
		started_on,    
		started_by,
		ownership_id                           		
	) values (                            
		@responsible_id, 36, @date, @branch, @description, @value, @title,                           
			case when @register_closed = 1 or @register_treated = 1 then 1 else 0 end,             
			case when @register_closed = 1 or @register_treated = 1 then @responsible_id else null end,              
			case when @register_closed = 1 or @register_treated = 1 then dbo.getCurrentDateTime() end,                 
				cast((case when @date < dbo.getCurrentDateTime() then 1 else 0 end) as bit),            
			@card_id, @register_treated,          
			case when @start_activity = 1 then dbo.getCurrentDateTime() else null end,                                   
			case when @start_activity = 1 then @responsible_id else null end,
			null
	)
	set @ownership_id = @@IDENTITY
	insert into @incidents(id) values (@ownership_id)        

	if(@new_support_id > 0)
	begin
		insert into incident(                            
			responsible_id, incident_type, [date], branch_id, [description], [value], title,    
			closed,             
			closed_by,              
			closed_on,     
			scheduled,             
			card_id, treated,     
			started_on,    
			started_by,
			ownership_id                           		
		) values (           		
			@responsible_id, 39, @date, @branch, @description, @value, @title,                           
				case when @register_closed = 1 or @register_treated = 1 then 1 else 0 end,             
				case when @register_closed = 1 or @register_treated = 1 then @responsible_id else null end,              
				case when @register_closed = 1 or @register_treated = 1 then dbo.getCurrentDateTime() end,                 
					cast((case when @date < dbo.getCurrentDateTime() then 1 else 0 end) as bit),            
				@card_id, @register_treated,          
				case when @start_activity = 1 then dbo.getCurrentDateTime() else null end,                                   
				case when @start_activity = 1 then @responsible_id else null end,
				@ownership_id
		)	
		insert into person_incident(person_id, participation_type, incident_id)                           
		values (@new_support_id, 1, @@IDENTITY)  	

		insert into @incidents(id) values (@@IDENTITY)
	end

	insert into person_incident(person_id, participation_type, incident_id)                           
	values (@new_owner_id, 1, @ownership_id)  	
 end  
                 
 while exists(select 1 from @people_incidents)                    
 begin                     
  declare @person_incident int = (select top 1 person_id from @people_incidents)                    
                    
  insert into incident(                            
   responsible_id, incident_type, [date], branch_id, [description], [value], title,    
   closed,             
   closed_by,              
   closed_on,     
   scheduled,             
   card_id, treated,     
   started_on,    
   started_by,
   ownership_id                           
  ) values (                            
   @responsible_id, @type, @date, @branch, @description, @value, @title,                           
   case when @register_closed = 1 or @register_treated = 1 then 1 else 0 end,             
   case when @register_closed = 1 or @register_treated = 1 then @responsible_id else null end,              
   case when @register_closed = 1 or @register_treated = 1 then dbo.getCurrentDateTime() end,                 
   cast((case when @date < dbo.getCurrentDateTime() then 1 else 0 end) as bit),            
   @card_id, @register_treated,          
   case when @start_activity = 1 then dbo.getCurrentDateTime() else null end,                                   
   case when @start_activity = 1 then @responsible_id else null end,
   @ownership_id   
  )                            
                            
  declare @incident int = @@identity                            
                
  insert into @incidents(id) values (@incident)        
        
  insert into person_incident(person_id, participation_type, incident_id)                           
   values (@person_incident, 1, @incident)                          
                    
  delete from @people_incidents where person_id = @person_incident                    
          
 end                                        
        
 if(@need_fund_value = 1 and @financial_type = 0)  
 begin  
 declare @payment_owner int, @payment_description varchar(400)   
   
 set @payment_description = 'Vida kung fu ''' + @title + ''' em ' + FORMAT(@date, 'MM/dd HH:mm')   
   
 select top 1 @payment_owner = person_id   
 from person_incident 
 where incident_id = @ownership_id
   
	exec RegisterNewIncident @type = 41, @people = @payment_owner,   
		@date = @date, @branch = @branch,                               
		@description = @payment_description, @responsible_id = @responsible_id,
		@ownership_id = @ownership_id
	
	                     
 end  
  
 select i.*         
 from vwLightIncident i         
  join @incidents ii on ii.id = i.id        
 for json path        
        
end 