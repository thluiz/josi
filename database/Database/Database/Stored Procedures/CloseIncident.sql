CREATE procedure [dbo].[CloseIncident](@incident int, @close_description varchar(max) = null, @responsible_id int = null)              
as              
begin               
 declare @person int, @type int, @card_id int
          
 select @card_id = card_id from incident where id = @incident        
        
 select @person = pic.person_id, @type = i.incident_type               
 from incident i              
  join  person_incident pic on pic.incident_id = i.id              
 where i.id = @incident        
        
  if(@card_id is not null)        
  begin        
  declare @close_step int        
  select top 1 @close_step = cs.id        
  from [card] c        
   join [card] parent on parent.id = c.parent_id        
   join [card_step] cs on cs.card_id = parent.id        
  where c.id = @card_id        
   and cs.is_closing_step = 1        
        
  exec SaveCardStep @card_id, @close_step, @responsible_id, @load_card = 0        
  end        
        
 update i set i.closed = 1,             
  i.[close_text] = isnull(@close_description, ''),        
  i.closed_on = getdate(),
  i.closed_by = @responsible_id           
 from incident i            
 where id = @incident                          
         
 update i set i.closed = 1         
  from incident i             
   join person_incident pic on pic.incident_id = i.id             
  where i.incident_type = @type            
   and i.treated = 1              
   and i.closed = 0        
   and pic.person_id = @person         

 if(@type = 10)
	exec SaveP1SessionsPerMonth @person
                   
 exec CheckPeopleStatus @person              
     
 select * from vwLightIncident    
 where id = @incident    
 for json path    
    
end  
  