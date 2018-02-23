CREATE procedure [dbo].[SaveIncidentComment](  
 @incident_id int,  
 @comment nvarchar(max),  
 @responsible int  = null  
)  
as  
begin  
  
 insert into incident_comment(incident_id, comment, responsible_id, created_at)   
 values (@incident_id, @comment, @responsible, dbo.getCurrentDateTime())  
  
 exec UpdateIncidentCommentCount @incident_id  
  
 select * 
 from vwIncident 
 where id = @incident_id
 for json path 

end  