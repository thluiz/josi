CREATE view vwProduct  
as  
select p.*, c.[name] currency, c.symbol currency_symbol from product p
	join currency c on c.id = p.currency_id