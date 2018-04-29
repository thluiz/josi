                                              
CREATE procedure [dbo].[GetDailyMonitor](                                                                          
 @week_modifier int = 0,                                                                          
 @branch int = null,                                                         
 @display int = 0, /* 0 = week, 1 = day, 2 = month */                
 @display_modifier int = 0,                
 @start_date date = null,                                                                          
 @end_date date = null,                
 @date date = null                
)                                                                                
as                                                                                
begin                                                                                
                 
 if(@start_date is null and @end_date is null)                
 begin                
  if(@display = 0)                
  begin                                           
  if(@week_modifier != 0 and @display_modifier = 0)                
   set @display_modifier = @week_modifier                
                                                              
  set @start_date = isnull(@start_date, DATEADD(WEEK, @display_modifier, DATEADD(d, -datepart(w, dbo.getCurrentDate())+2, dbo.getCurrentDate())))                                                                                 
  set @end_date = isnull(@end_date, DATEADD(WEEK, @display_modifier,cast(DATEADD(d, 8-datepart(w, dbo.getCurrentDate()), dbo.getCurrentDate()) as date)))                                                                                
  end                
  else if(@display = 1)                
  begin                
  set @start_date = isnull(@start_date, DATEADD(day, @display_modifier, dbo.getCurrentDate()))                 
  set @end_date = isnull(@end_date, @start_date)                      
  end                                  
  else if(@display = 2)                
  begin                
  declare @current_date date = DATEADD(month, @display_modifier, dbo.getCurrentDate())                
  declare @month int = datepart(MONTH, @current_date)                
  declare @year int = datepart(year, @current_date)                
  declare @last_day_of_month date = dateadd(day, -1, dateadd(month, 1, DATEFROMPARTS(@year, @month, 1)))                
                
  select @last_day_of_month                
                
  set @start_date = isnull(@start_date, DATEFROMPARTS(@year, @month, 1))                                                                                 
  set @end_date = isnull(@end_date, @last_day_of_month)                                                                                
  end                 
 end                
                
 declare @dates table([date] date, [current] bit)                                                                                
                                              
 declare @people table([name] varchar(300), domain varchar(100), domain_id int, branch_id int,                         
 branch_abrev varchar(30), branch_initials varchar(3),                        
 person_id int, n int, financial_status int not null default 0, financial_description varchar(max),                                               
 scheduling_status  int not null default 0, scheduling_description varchar(max), avatar_img varchar(100),                                              
 program_id int, comunication_status int not null default 0, comunication_description varchar(max),                                              
 kf_name varchar(100), kf_name_ideograms nvarchar(100), family_abrev varchar(10),                      
 is_disciple bit, is_leaving bit, is_inactive_member bit, admission_date date,             
 data_status bit not null default 0, data_status_description varchar(max), has_birthday_this_month bit not null default 0,  
 birth_date datetime default getdate(), is_interested bit not null default 0, is_service_provider  bit not null default 0, 
 is_associated_with_member  bit not null default 0, is_external_member  bit not null default 0)                                                                             
       
       
 select *               
 into #incidents              
 from vwIncident i                              
 where i.full_date between @start_date and dateadd(day, 1, @end_date)                                                                        
 and i.branch_id = isnull(@branch, i.branch_id)                                                 
 and i.cancelled = 0                                         
                                                    
 insert into @dates                                                     
  select [date], case when DATEPART(w, [date]) = datepart(w, dbo.getCurrentDate()) then 1 else 0 end                         
  from DateRange('d', @start_date, @end_date)                                                                                
                                                                                         
 insert into @people(                                              
	[name], domain, domain_id,                                               
	person_id, financial_status, financial_description,                                               
	scheduling_status, scheduling_description, avatar_img,                                              
	program_id, comunication_status, comunication_description,                                              
	kf_name, kf_name_ideograms,                       
	branch_id, branch_abrev, branch_initials,                         
	family_abrev, is_disciple, is_leaving, is_inactive_member,                     
	admission_date, data_status, data_status_description,      
	has_birthday_this_month, birth_date,
	is_interested, is_service_provider, 
	is_associated_with_member, is_external_member                       
 )                                                                                                                                 
  select [name],                                                                                
	[domain], [domain_id], id,                                                                                                                                             
	financial_status, [financial_description],                                                                               
	scheduling_status, [scheduling_description],                                                                            
	avatar_img, program_id,                                                                         
	comunication_status, comunication_description,                                                            
	kf_name, kf_name_ideograms,                      
	branch_id, branch_abrev, branch_initials,                      
	family_abrev, is_disciple, is_leaving, is_inactive_member,                          
	admission_date, data_status, data_status_description,      
	has_birthday_this_month, birth_date,
	is_interested, is_service_provider, 
	is_associated_with_member, is_external_member                         
  from vwPerson  p                   
  where branch_active = 1                                                                          
	and p.is_active_member = 1
	and p.branch_id = isnull(@branch, p.branch_id)                                                             
                                               
                                              
 insert into @people(person_id, [name], avatar_img, branch_id, branch_abrev,  
  financial_status, financial_description,                                               
  scheduling_status, scheduling_description,  
  comunication_status, comunication_description,  
  data_status, data_status_description,
  is_interested, is_service_provider, 
  is_associated_with_member, is_external_member  
 )                                              
   select p.id, p.[name], avatar_img, isnull(p.branch_id, -1), isnull(p.branch_abrev, ''),  
  financial_status, financial_description,                                               
  scheduling_status, scheduling_description,  
  comunication_status, comunication_description,  
  data_status, data_status_description,
  p.is_interested, p.is_service_provider, 
  p.is_associated_with_member, p.is_external_member                                            
 from vwPerson p                                                                                
 where ((p.branch_id is null) 
		or (p.branch_id != isnull(@branch, p.branch_id))
		or (
				p.branch_id = isnull(@branch, p.branch_id) 
				and (
					p.is_interested = 1
					or p.is_service_provider = 1
					or p.is_associated_with_member = 1 
					or p.is_external_member = 1		
					or p.is_inactive_member = 1
					or p.is_leaving = 1					
				) 
			)
		)                                               
   and exists(                                              
		select 1 from #incidents i where i.person_id = p.id                                                 
   )                                              
                       
 select *             
 into #columns                                                                                
 from (                                                                                 
  select LEFT(CONVERT(VARCHAR(15), [date], 103), 5) + ' - ' + (           
 SELECT  CASE DATEPART(WEEKDAY,[date])                                                                                
  WHEN 1 THEN 'D'                                                       
  WHEN 2 THEN '2a'                                                                              
  WHEN 3 THEN '3a'                                                                               
  WHEN 4 THEN '4a'                                                                             
  WHEN 5 THEN '5a'                                                                               
  WHEN 6 THEN '6a'                                                                               
  WHEN 7 THEN 'S'                                                                               
 END                                                                                
  )as [name], null prop, [date], [current]                                                                                
  from @dates                                                                                
 ) c                                                                                
 order by [date]                                                                                  
                                                                  
 select (                                                                                
  select [name], [domain], person_id, [domain_id],                                                                                 
   financial_status, [financial_description],                                                                               
   scheduling_status, [scheduling_description],                                                                            
   avatar_img, program_id, kf_name,                                                        
   comunication_status, comunication_description,                                              
   branch_abrev, branch_id, kf_name_ideograms,                       
   branch_initials, family_abrev family_name,                      
   is_disciple, is_leaving, is_inactive_member,                    
   admission_date, data_status, data_status_description, has_birthday_this_month,
   person_id id,
	is_interested, is_service_provider, 
	is_associated_with_member, is_external_member                                                                         
   from @people                                                                                 
   order by isnull(admission_date, DATEADD(year, 1, getdate())), birth_date desc                                                                       
   for json path                                                                  
 ) [people],                                                                                 
 (                                                                                
  select * from #columns                                                    
   for json path                                                                                
 ) [week_days],                                                                                
  (                                                                                
  isnull((select *            
 from #incidents                                                             
 order by full_date                                                                             
  for json path), (select cast(1 as bit) [empty] for json path))                                                  
 ) [incidents],                                                             
 (                                                                                
  select d.*, p.long_name program                                                      
  from domain d                                                              
  join program p on d.program_id = p.id                                                                           
  where exists(select 1 from person p                                                    
				join person_incident i on i.person_id = p.id                                                                           
				where p.domain_id = d.id                                                              
					and p.is_active_member = 1
					and p.branch_id = isnull(@branch, p.branch_id))                              
	order by [order]                                                                              
  for json path                                                               
 ) [domains],                              
 (                                                                                
  select *                                                                          
  from branch                                                     
  where active = 1                                                                              
  for json path                                                                                
 ) [branches],                                                            
 (                                                                        
  select                                    
  (LEFT(CONVERT(VARCHAR(15), @start_date, 103), 5) +            
  case when @display = 1 then ''             
  else                                                                         
 ' - '                                                                           
 + LEFT(CONVERT(VARCHAR(15), @end_date, 103), 5)            
  end) [range],                                     
  cast((case when dbo.getCurrentDate() >= @start_date and dbo.getCurrentDate() <= @end_date then 1 else 0 end) as bit) [current]                                    
  for json path                                    
 ) selected_week,                                    
 isnull(@branch, -1) branch,                                                                  
 (                                                                  
  select * from vwIncidentType                                                                 
  order by [order]                                                                  
  for json path                                                                  
 ) incident_types                  
 for json path                                                                                
                                                                                                    
 drop table #columns                                                                                
 drop table #incidents                       
                 
                                                                                
end 