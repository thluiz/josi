create function getCurrentDate()  
returns date
as  
begin  
  
 return cast(dateadd(hour, -2, getdate()) as date)  
  
end