CREATE procedure GetDataForVoucher    
as    
begin     
    
 select    
  (select *,  
 (  
  select *   
  from vwBranchMap bm  
  where bm.active = 1   
  for json path    
 ) voucher_map   
  from branch b    
  where active = 1   
 and exists(    
    select 1     
    from branch_map bm    
    where receive_voucher = 1    
  and bm.active = 1    
  and bm.branch_id = b.id)    
   for json path) branches,
   (select * from voucher where active = 1 for json path) vouchers  
 for json path    
    
end    
    

	-- select * from voucher