CREATE procedure [dbo].[GetCommentsAboutPerson](  
 @person_id int,  
 @comments_per_page int = 5,  
 @page int = 1,  
 @show_archived bit = 0  
)  
as  
begin  
  
 if(not exists(select 1 from person_comment pc where pc.person_id = @person_id and archived = 0))  
 begin  
  select cast(1 as bit) empty for json path  
  return  
 end  
  
 select pc.id, pc.comment, pc.pinned, pc.responsible_id, pc.created_at,   
  CONVERT (VARCHAR, pc.created_at, 103) created_date_br,  
  convert(char(5), pc.created_at, 108) created_hour_br  
 from person_comment pc  
 where pc.person_id = @person_id  
 and (@show_archived = 1 or archived = 0)
 ORDER BY pc.pinned, pc.created_at  
 OFFSET ((@page - 1) * @comments_per_page) ROWS  
 FETCH NEXT @comments_per_page ROWS ONLY  
 for json path  
  
end