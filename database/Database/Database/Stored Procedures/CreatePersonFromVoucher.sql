CREATE procedure [dbo].[CreatePersonFromVoucher](        
 @name varchar(200),        
 @email varchar(100),        
 @cpf varchar(11),        
 @socialLinks varchar(100),        
 @phone varchar(100),        
 @branch_id int,      
 @branch_map_id int,    
 @voucher_id int = 1,       
 @additionalAnswer varchar(300) = ''       
)        
as        
begin        
 declare @current_date datetime = dbo.getcurrentDateTime(),      
  @monitoring_project int, @branch_location_id int,      
  @responsible_id int, @schedule_description varchar(max)      
          
        
 select @monitoring_project = c.id,       
    @branch_location_id = b.location_id,      
    @responsible_id = c.leader_id      
 from card c       
  join branch b on c.location_id = b.location_id      
 where c.card_template_id = 11 and b.id = @branch_id      
        
 insert into person([name], branch_id, identification2, scheduling_status, is_interested)        
 values (@name, @branch_id, @cpf, 1, 1)        
             
  
 declare @person_id int = @@Identity        
         
 if(len(@socialLinks) > 0)        
  insert into person_contact(person_id, contact_type, contact)        
  values (@person_id, 4, @socialLinks)         
          
 if(len(@phone) > 0)        
  insert into person_contact(person_id, contact_type, contact)        
  values (@person_id, 2, @phone)         
        
 if(len(@email) > 0)        
  insert into person_contact(person_id, contact_type, contact)        
  values (@person_id, 1, @email)              
    
 insert into person_comment(person_id, comment)      
  select @person_id, 'Proveniente do Voucher: ' + title      
  from voucher where id = @voucher_id        
      
 if(LEN(@additionalAnswer) > 0)   
 begin   
  declare @question	nvarchar(max) = (select additional_question from voucher where id = @voucher_id )
  insert into person_comment(person_id, comment)      
  values(@person_id, 'Resposta a pergunta ' + isnull(@question, 'Pergunta:') + ': ' + @additionalAnswer)      
 end
        
 insert into person_voucher(person_id, voucher_id, branch_map_id, additional_answer)    
 values ( @person_id, @voucher_id, @branch_map_id, @additionalAnswer)    
       
 insert into person_role(person_id, role_id)      
  values (@person_id, 4)            
            
 exec SaveCard @title = null, @description = 'Contato por meio de Voucher',      
  @parent_id = @monitoring_project,       
  @due_date = @current_date, @card_template_id = 1,      
  @location_id = @branch_location_id,         
  @people = @person_id, @branch_id = @branch_id,      
  @responsible_id = @responsible_id          
      
 declare @card_id int = (select card_id from person_card pc where pc.person_id = @person_id and position = 5)        
    
 update [card] set current_step_id = (select top 1 cs.id     
          from card_step cs    
           join [card] c on card.parent_id = cs.card_id    
          where c.id = @card_id)    
 where id = @card_id       
    
 select @schedule_description = 'Horário escolhido no Voucher: '+ isnull(bm.base_description, bm.id)    
 from vwBranchMap bm    
 where id = @branch_map_id      
    
 insert into person_comment(person_id, comment)      
  values (@person_id, @schedule_description)     
         
 exec SaveCardCommentary @card_id = @card_id,     
    @commentary = @schedule_description,    
    @responsible_id = @person_id,    
    @commentary_type = 1,    
    @load_comments = 0          
          
end