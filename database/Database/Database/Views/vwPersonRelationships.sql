CREATE view vwPersonRelationships  
as  
select pr.*, p1.name indicated_by, p2.name indicated_name    
from person_relationship pr  
 join vwPerson p1 on p1.id = pr.person_id  
 join vwPerson p2 on p2.id = pr.person2_id