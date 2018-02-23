CREATE procedure [dbo].[DeleteTestData]  
as  
begin   
 declare @name varchar(150) = 'teste'  
  
 delete pic   
 from person_incident pic   
  join person p on pic.person_id = p.id  
 where [name] like '%' + @name + '%'  
  
 delete pr  
  from person_role pr  
  join person p on pr.person_id = p.id  
  where [name] like '%' + @name + '%'  

 delete pc  
  from person_comment pc  
  join person p on pc.person_id = p.id  
  where [name] like '%' + @name + '%'  
  
  
 delete pc  
  from person_contact pc  
  join person p on pc.person_id = p.id  
  where [name] like '%' + @name + '%'

 delete from person where [name] like '%' + @name + '%'  
  
end  
  