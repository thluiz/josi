

CREATE procedure GetCurrentActivities(    
 @branch int = null    
)    
as    
begin    
  
if(not exists(  
 select top 1 1  
 from incident i1 (nolock)    
  where     
   ((started_on is not null and datepart(hour, started_on) > 0) or closed_on > dateadd(minute, -1, dbo.getCurrentDateTime()))    
   and i1.closed = 0     
   and i1.treated = 0     
   and i1.cancelled = 0    
   and i1.branch_id =  ISNULL(@branch, i1.branch_id)    
)) begin  
 select CAST(1 as bit) empty for json path  
 return  
end  
	declare @current_activities table (id int)
	declare @next_activities table (next_id int, current_incident_id int, next_date datetime)

		
	insert into @current_activities(id)
		select i.id 	
		from incident i (nolock) 
			join enum_incident_type eit (nolock) on eit.id = i.incident_type and eit.need_to_be_started = 1
		where	
		  started_on is not null 	  
		  and (closed = 0 or closed_on > dateadd(minute, -1, dbo.getCurrentDateTime()))    	  
		  and i.treated = 0     
		  and i.cancelled = 0
		  and i.branch_id =  ISNULL(@branch, i.branch_id)  

  insert into @next_activities(next_id, current_incident_id, next_date)
  select distinct ni.id, ci.id, ni.date     
  from incident ni (nolock) 
	join person_incident nip (nolock) on nip.incident_id = ni.id 			
	join enum_incident_type neit (nolock) on neit.id = ni.incident_type
	join (select i.*, pic.person_id 
		from incident i (nolock)
			join @current_activities ca on ca.id = i.id	
			join person_incident pic (nolock) on pic.incident_id = ca.id 			
	) ci on ci.date < ni.date
		and nip.person_id = ci.person_id
  where ni.started_on is null  	
	and ni.cancelled = 0
	and ni.treated = 0
	and ni.closed = 0
	and cast(ni.date as date) = dbo.getCurrentDate()	
	and neit.need_to_be_started = 1  


  
 select *,    
	(
	select ni.* 
	from @next_activities na
		join vwIncident ni on ni.id = na.next_id
	where na.current_incident_id = i1.id
	order by na.next_date
	for json path) next_incident,
    (select         
		p2.id,  
		p2.scheduling_status,  pss.description scheduling_description,         
		p2.comunication_status, p2.comunication_description,        
		p2.financial_status, pfs.description financial_description,        
		p2.data_status, p2.data_status_description        
     from person p2 (nolock) 
			left join dbo.enum_person_financial_status pfs (nolock)  on pfs.id = p2.financial_status                                                                                                            
			left join dbo.enum_person_scheduling_status pss (nolock)  on pss.id = p2.scheduling_status                                                                         
		where p2.id = i1.person_id    
     for json path) person_data     
 from vwIncident i1  (nolock)   
 where i1.id in (select id from @current_activities)   
 order by case when i1.[type] = 36 then 0 when i1.[type] = 39 then 1 else 2 end, started_on_hour    
 for json path  
      
end