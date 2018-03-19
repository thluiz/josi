CREATE procedure [dbo].[CloseIncident](@id int, @close_description varchar(max) = null, @responsible_id int = null)        
as        
begin         
 declare @person int, @type int, @card_id int   
    
 select @card_id = card_id from incident where id = @id  
  
 select @person = pic.person_id, @type = i.incident_type         
 from incident i        
  join  person_incident pic on pic.incident_id = i.id        
 where i.id = @id  
  
  if(@card_id is not null)  
  begin  
  declare @close_step int  
  select top 1 @close_step = cs.id  
  from [card] c  
   join [card] parent on parent.id = c.parent_id  
   join [card_step] cs on cs.card_id = parent.id  
  where c.id = @card_id  
   and cs.is_closing_step = 1  
  
  exec SaveCardStep @card_id, @close_step, @responsible_id  
  end  
  
 update i set i.closed = 1,       
  i.[close_text] = isnull(@close_description, ''),  
  i.closed_on = dbo.getCurrentDateTime()     
 from incident i      
 where id = @id        
             
 if(@type in (1, 29))  
 begin  
  update person set person.scheduling_status = 0   
   where id = @person    
  
 end  
 else if(@type = 24)  
 begin  
  update person set person.financial_status = 0   
   where id = @person    
 end  
   
 update i set i.closed = 1   
  from incident i       
   join person_incident pic on pic.incident_id = i.id       
  where i.incident_type = @type      
   and i.treated = 1        
   and i.closed = 0  
   and pic.person_id = @person   
             
 exec CheckPeopleStatus @person        
        
end  
  