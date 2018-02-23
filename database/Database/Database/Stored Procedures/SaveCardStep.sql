create procedure SaveCardStep(@card_id int, @step_id int)
as
begin
	update [card] set current_step_id = @step_id where id = @card_id

	select * from vwCard where id = @card_id
	for json path

end