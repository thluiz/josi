create procedure ToglePersonCommentPinned(
	@comment_id int
) as
begin

	update person_comment set pinned = case when pinned = 1 then 0 else 1 end
	where id = @comment_id

end