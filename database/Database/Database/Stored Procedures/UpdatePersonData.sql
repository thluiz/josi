CREATE procedure [dbo].[UpdatePersonData](                
 @id int,                
 @name varchar(200),                
 @birth_date date,                
 @admission_date date,                
 @enrollment_date date,                
 @baaisi_date date,                
 @kf_name varchar(200),  
 @identification varchar(50),  
 @identification2 varchar(50),  
 @passport varchar(50),  
 @passport_expiration_date date,  
 @occupation varchar(100),  
 @kf_name_ideograms NVarchar(200),              
 @family_id int,            
 @branch_id int,            
 @program_id int,            
 @domain_id int,
 @destiny_family_id int
) as                
begin                 
 if(@kf_name is not null)                
 begin                
  delete from person_alias where person_id = @id and kungfu_name = 1                      
                
  insert into person_alias(person_id, alias, kungfu_name, ideograms)                      
   values(@id, @kf_name, 1, @kf_name_ideograms)                      
 end                
                
 update person set [name] = @name,                
  birth_date = @birth_date,          
  admission_date = @admission_date,                
  baaisi_date = @baaisi_date,          
  family_id = @family_id, branch_id = @branch_id,             
  program_id = @program_id, domain_id = @domain_id,    
  enrollment_date = @enrollment_date,  
  identification = @identification,   
  identification2 = @identification2,   
  occupation = @occupation,  
  passport = @passport,  
  passport_expiration_date = @passport_expiration_date,
  destiny_family_id = @destiny_family_id
 where id = @id              
         
 exec CheckPeopleStatus @id        
      
 exec GetPersonData @id      
                 
end