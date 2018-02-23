﻿  
        
CREATE procedure [dbo].[GetPeopleSummary](                                    
 @week_modifier int = 0,                                     
 @branch int = null,                  
 @date date = null                                    
)                                          
as                                          
begin                                          
 if(@date is null)  
  set @date = getdate()         
                                                             
 declare @week int = (select id   
      from [week]   
      where [start] <= DATEADD(week, @week_modifier, dbo.getCurrentDate())  
       and [end] >= DATEADD(week, @week_modifier, dbo.getCurrentDate()))  
                                          
 declare @people_summary table(program varchar(50), people int, comunications int, financial int, scheduling int)         
  
 insert into @people_summary(program, people,                   
      financial, scheduling, comunications)                    
  select pp.[name] program, sum(ms.people),                   
      sum(ms.financial_issues), sum(ms.scheduling_issues), sum(ms.comunication_issues)                     
  from program pp                      
   join members_sumary ms on ms.program_id = pp.id                  
  where ms.branch_id = isnull(@branch, ms.branch_id)                  
   and ms.week_id = @week  
  group by pp.[name]                 
                      
 insert into @people_summary(program, people, financial, scheduling, comunications)                    
  select 'Total', sum(people), sum(financial), sum(scheduling), sum(comunications)                    
  from @people_summary                      
  
 select *   
 from @people_summary   
 order by program  
 for json path, root('people_summary')  
                                                                       
end   
  