CREATE function getCurrentDateTime()    
returns datetime    
with schemabinding
as    
begin    
    
 return dateadd(hour, -3, getdate())    
    
end