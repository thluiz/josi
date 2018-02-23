CREATE procedure [dbo].[GetProject](@project_id int, @user int = null)                
as                
begin                
                          
 select *,
 (          
  select
    *
   from dbo.vwCard           
   where parent_id = c.id      
   and current_step_id is null         
   and cancelled = 0  
   and archived = 0       
   order by [order]       
  for json path      
 ) childrens,
 (          
  select *,
   (    
    select * from dbo.vwCard ch          
     where parent_id = c.id      
		and current_step_id = cs.id      
		and cancelled = 0  
		and archived = 0     
	order by ch.[order]              
    for json path    
   ) childrens       
  from dbo.card_step cs           
  where cs.card_id = c.id    
  and archived = 0            
  order by cs.[order]
  for json path      
 ) steps                  
 from [vwCard] c                
 where    
 c.id = isnull(@project_id, c.id)                
 order by [order]               
 for json path                                           
    
end   
  