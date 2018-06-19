CREATE view vwPersonRelationships      
as      
select pr.*, p1.name indicated_by, p2.name indicated_name, rt.name relationship_description        
from person_relationship pr      
 join enum_relationship_type rt on rt.id = pr.relationship_type     
 join vwPerson p1 on p1.id = pr.person_id      
 join vwPerson p2 on p2.id = pr.person2_id