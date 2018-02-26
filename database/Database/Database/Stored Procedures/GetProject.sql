CREATE procedure [dbo].[GetProject](@project_id int, @user int = null)                
as                
begin                
                          
 select *,
 cast(case when 
	exists(select 1 from [card] parent where parent.id = c.parent_id and parent.parent_id is null ) 
	then 
	 0
	else 1 end as bit)  is_subproject,
 (          
  select
    *
   from dbo.vwCard (nolock)          
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
    select * from dbo.vwCard ch (nolock)          
     where parent_id = c.id      
		and current_step_id = cs.id      
		and cancelled = 0  
		and archived = 0     
	order by ch.[order]              
    for json path    
   ) childrens       
  from dbo.card_step cs (nolock)           
  where cs.card_id = c.id    
  and archived = 0            
  order by cs.[order]
  for json path      
 ) steps                  
 from [vwCard] c (nolock)                
 where    
 c.id = isnull(@project_id, c.id)                
 order by [order]               
 for json path                                           
    
end   
  