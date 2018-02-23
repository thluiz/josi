                                                    
CREATE procedure [dbo].[GetAgenda](                                                                                                      
 @branch int = null,                                                                
 @date date = null        
)                                                                                      
as                                                                                      
begin          
-- declare @branch int, @display_modifier int = 0          
                          
 if(@date is null)        
 set @date = dbo.getCurrentDate()        
                          
 if(not exists(
	 select 1
	  from vwIncident i (nolock)            
	 where i.cancelled = 0          
	  and i.branch_id = ISNULL(@branch, i.branch_id)          
	  and i.[date] = @date          
	  and i.need_start_hour_minute = 1)) 
 begin
	select cast(1 as bit) empty
	for json path
	return 
 end						  
						                                                                                                                                        
 select DATEPART(HOUR, i.full_date) schedule_group,          
  (select *,    (select     
      p2.id,      
      p2.scheduling_status, p2.scheduling_description,         
      p2.comunication_status, p2.comunication_description,        
      p2.financial_status, p2.financial_description,        
      p2.data_status, p2.data_status_description        
      from vwPerson p2 where p2.id = i2.person_id         
      for json path) person_data                
   from vwIncident i2 (nolock)            
   where i2.cancelled = 0          
    and i2.branch_id = ISNULL(@branch, i2.branch_id)          
    and i2.[date] = @date       
 and need_start_hour_minute = 1       
    and DATEPART(HOUR, i2.full_date) = DATEPART(HOUR, i.full_date)    
   order by DATEPART(HOUR, i2.full_date),    
  case when i2.[type] = 36 then 0 else 1 end,          
     i2.full_date, isnull(i2.admission_date, dateadd(year, 1, dbo.getCurrentDate())), i2.[person]          
   for json path          
  ) incidents           
 from vwIncident i (nolock)            
 where i.cancelled = 0          
  and i.branch_id = ISNULL(@branch, i.branch_id)          
  and i.[date] = @date          
  and i.need_start_hour_minute = 1        
 group by DATEPART(HOUR, i.full_date)    
 order by DATEPART(HOUR, i.full_date)    
 for json path                                                                                  
          
          
end 