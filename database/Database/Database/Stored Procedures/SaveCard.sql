CREATE procedure [dbo].[SaveCard](
	@title nvarchar(500),
	@parent_id int, 
	@due_date datetime,
	@description nvarchar(max),
	@card_template_id int,
	@location_id int,
	@abrev nvarchar(15),
	@leader_id int
)
as
begin 

	insert into [card]
	(title, parent_id, due_date, feature_area_id, [description], [leader_id], card_template_id, location_id, abrev)
	values
	(@title, @parent_id, @due_date, 1, @description, @leader_id, @card_template_id, @location_id, @abrev)	

	declare @card_id int = @@IDENTITY

	insert into [card_step]([name], card_id, is_blocking_step, is_closing_step, need_action)
	values ('A fazer', @card_id, 0, 0, 0), ('Fazendo', @card_id, 0, 0, 1), ('Feito', @card_id, 0, 1, 0)


	select * from vwCard
	where id = @card_id
	for json path

end