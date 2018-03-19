CREATE procedure [dbo].[ReopenIncident](@id int, @responsible_id int = null)        
as        
begin        
	declare @card_id int 	  
	select @card_id = card_id from incident where id = @id

	update i set i.closed = 0,         
		i.closed_on = null
	from incident i      
	where id = @id 
	
	if(@card_id is not null)
	 begin
		declare @doing_step int
		select top 1 @doing_step = cs.id
		from [card] c
			join [card] parent on parent.id = c.parent_id
			join [card_step] cs on cs.card_id = parent.id
		where c.id = @card_id
			and cs.start_incident = 1

		exec SaveCardStep @card_id, @doing_step, @responsible_id
	 end       
        
end    