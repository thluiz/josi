create procedure GetBranches(
	@active bit = 1
)
as
begin

	select * 
	from branch b
	where b.active = ISNULL(@active, b.active) 
	for json path

end