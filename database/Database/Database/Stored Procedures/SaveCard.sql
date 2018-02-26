CREATE procedure [dbo].[SaveCard](  
 @title nvarchar(500),  
 @parent_id int,   
 @due_date datetime,  
 @description nvarchar(max),  
 @card_template_id int,  
 @location_id int,  
 @abrev nvarchar(15),  
 @leader_id int,
 @people varchar(max),
 @group_id int,
 @branch_id int,
 @new_people varchar(max) 
)  
as  
begin   
 declare @require_target bit, 
		@require_target_group bit, 
		@is_task bit, @card_id int

 select @require_target = require_target, 
		@require_target_group = require_target_group,
		@is_task = is_task
 from card_template where id = @card_template_id
 
 if(@is_task = 1)
 begin 

	 if(@require_target = 0) 
	 begin
		 insert into [card]  
		 (title, parent_id, due_date, feature_area_id, [description], [leader_id], card_template_id, location_id, abrev)  
		 values  
		 (@title, @parent_id, @due_date, 1, @description, @leader_id, @card_template_id, @location_id, @abrev)   

		 set @card_id = @@IDENTITY  
	 end
	 else
	 begin
	    select item
		into #people
		from dbo.split(@people, ',')

		if(len(isnull(@new_people, '')) > 0)            
		begin                        
			select distinct ltrim(rtrim(item)) [name]            
			into #new_people            
			from dbo.Split(@new_people, ',')            
            
			while(exists(select 1 from #new_people))            
			begin            
				declare @name varchar(200) = (select top 1 [name] from #new_people)            
            
				insert into person([name], is_interested) values (@name, 1)                   
                
				declare @new_person int = @@identity            
				insert into person_role(person_id, role_id) values (@new_person, 4)  
  
				insert into #people(item) values (@new_person)       
            
				delete from #new_people where [name] = @name                  		
			end  

			drop table #new_people
		end

		while exists(select 1 from #people)
		begin
			declare @person int = (select top 1 item from #people)

			insert into [card]  
			 (title, parent_id, due_date, feature_area_id, [description], [leader_id], card_template_id, location_id, abrev)  
			 values  
			 (@title, @parent_id, @due_date, 1, @description, @leader_id, @card_template_id, @location_id, @abrev)   

			 set @card_id = @@IDENTITY 

			 insert into person_card(person_id, card_id, position)	
			 values (@person, @card_id, 5)		
			 
			 delete from #people where item = @person 			 
			 
		end

		drop table #people
	 end

 end 
 else 
 begin

 	insert into [card]  
	(title, parent_id, due_date, feature_area_id, [description], [leader_id], card_template_id, location_id, abrev)  
	values  
	(@title, @parent_id, @due_date, 1, @description, @leader_id, @card_template_id, @location_id, @abrev) 
	
	set @card_id = @@IDENTITY 

	insert into [card_step]([name], card_id, is_blocking_step, is_closing_step, need_action)  
	values (
	case when @card_template_id != 2 then 
		'A Fazer'
	else 
		'A Convidar'
	end	
	, @card_id, 0, 0, 0)
	
	declare @card_step_id int = @@IDENTITY

	if(@require_target_group = 1)
	begin
		exec GenerateCardsForGroup @card_id, @card_step_id, @group_id, @branch_id
	end

	exec GenerateAditionalStepsForCard @card_id

 end   
   
    
 select * from vwCard  
 where id = @card_id  
 for json path  
  
end