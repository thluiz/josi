CREATE procedure [dbo].[SaveCardStep](@card_id int, @step_id int, @responsible_id int = null)  
as  
begin  
 declare @is_closing_step bit, @is_negative_closing_step bit, @history_type int = 1, @start_incident bit = 0  
  
 select @is_closing_step = is_closing_step,   
   @is_negative_closing_step = is_negative_closing_step,  
   @start_incident = cs.start_incident  
 from card_step cs where cs.id = @step_id   
  
 if(@is_closing_step = 1 or @is_negative_closing_step = 1)  
 begin  
  exec [SaveCardHistory] @card_id, 3, @responsible_id  
  
  -- if incident is not started yet, update its started_on  
  update i set started_on = dbo.getCurrentDateTime()   
  from incident i  
  where card_id = @card_id   
   and started_on is null   
   and closed_on is null  
   and closed = 0  
   and cancelled = 0   
  
  update i set closed_on = dbo.getCurrentDateTime(), closed = 1   
  from incident i  
  where card_id = @card_id   
   and started_on is not null   
   and closed_on is null  
   and closed = 0  
   and cancelled = 0  
  
  update [card] set closed = 1, closed_on = dbo.getCurrentDateTime() where id = @card_id and closed = 0
  
 end    
 else
 begin
	update [card] set closed = 0, closed_on = null where id = @card_id and closed = 1
 end
  
 if(@start_incident = 1)  
 begin   
  update i set started_on = dbo.getCurrentDateTime()   
  from incident i  
  where card_id = @card_id   
   and started_on is null   
   and closed_on is null  
   and closed = 0  
   and cancelled = 0     
 end  
    
 update [card] set current_step_id = @step_id where id = @card_id  
   
 exec [SaveCardHistory] @card_id, 1, @responsible_id, @step_id
 exec CheckCardsHasOverdueCards @card_id    
   
 select * from vwCard where id = @card_id  
 for json path  
  
end