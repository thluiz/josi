  
CREATE procedure GetCurrentActivities(  
 @branch int = null  
)  
as  
begin  

if(not exists(
	select top 1 1
	from vwIncident i1  
	 where   
	  (started_on_hour is not null or closed_on > dateadd(minute, -1, dbo.getCurrentDateTime()))  
	  and closed = 0   
	  and treated = 0   
	  and cancelled = 0  
	  and i1.branch_id =  ISNULL(@branch, i1.branch_id)  
)) begin
	select CAST(1 as bit) empty for json path
	return
end


 select *,  
  (select top 1 * from vwIncident i2   
   where need_to_be_started = 1   
    and started_on_hour is null   
    and cancelled = 0  
    and closed = 0  
    and treated = 0  
    and i2.person_id = i1.person_id  
    and i1.date = i2.date  
    and i2.branch_id = i1.branch_id  
   order by i2.full_date  
   for json path) next_incident,  
    (select       
	p2.id,
    p2.scheduling_status, p2.scheduling_description,       
    p2.comunication_status, p2.comunication_description,      
    p2.financial_status, p2.financial_description,      
    p2.data_status, p2.data_status_description      
     from vwPerson p2 where p2.id = i1.person_id       
     for json path) person_data   
 from vwIncident i1  
 where   
  (started_on_hour is not null or closed_on > dateadd(minute, -1, dbo.getCurrentDateTime()))  
  and closed = 0   
  and treated = 0   
  and cancelled = 0  
  and i1.branch_id =  ISNULL(@branch, i1.branch_id)  
 order by case when i1.[type] = 36 then 0 else 1 end, started_on_hour  
 for json path   
end  
  