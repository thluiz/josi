CREATE procedure GenerateAditionalStepsForCard(
	@card_id int
)
as
begin
	
	declare @card_template_id int = (select card_template_id from [card] where id = @card_id)

	if(@card_template_id != 2)	
		insert into [card_step]([name], card_id, is_blocking_step, is_closing_step, need_action)  
		values ('Fazendo', @card_id, 0, 0, 1), ('Feito', @card_id, 0, 1, 0)

	if(@card_template_id = 2)
	begin
		insert into [card_step]([name], card_id, need_action)
		values ('Convidados', @card_id, 1)
		 	
		insert into [card_step]([name], card_id, need_action, generate_incident)
		values ('Confirmados', @card_id, 1, 1)

		insert into [card_step]([name], card_id, need_action, is_closing_step, close_financial_incident)
		values ('Inscritos', @card_id, 0, 1, 1)

		insert into [card_step]([name], card_id, need_action, is_negative_closing_step)
		values ('Não participarão', @card_id, 0, 1)

	end	
			
end