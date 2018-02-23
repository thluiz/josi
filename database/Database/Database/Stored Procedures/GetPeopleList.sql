  
CREATE procedure [dbo].[GetPeopleList]    
as    
begin    
    
  select pp.id, pp.id person_id, pp.avatar_img, pp.admission_date, convert(varchar, pp.admission_date, 103) admission_date_br,    
    pp.financial_status, pp.scheduling_status, pp.is_leaving, pp.is_inactive_member,    
    pp.[name], pp.kf_name_ideograms, pp.kf_name,    
    pp.branch_abrev, pp.family_abrev, pp.branch_initials,  
	pp.data_status, pp.data_status_description,   
	pp.scheduling_description, pp.financial_description,  
	pp.issues_level, pp.branch_id, pp.has_birthday_this_month,
	pp.comunication_status
  from vwPerson pp  
  where pp.branch_active = 1  
  order by is_leaving DESC, is_inactive_member DESC, isnull(pp.admission_date, DATEADD(day, 1, getdate())), pp.birth_date, pp.[name]    
  for json path  
  
end    
    