select

min(convoUser) as Username,
min(convert(varchar, convoTS, 101)) as ConvoDate,
min(convoTransID) as convoTransID,
case 
   when  substring(min(convoIntent), 1, 9) like 'ROOT-FAIL' then substring(min(convoIntent), 11, len(min(convoIntent))) 
   when  substring(min(convoIntent), 1, 4) like 'ROOT' then substring(min(convoIntent), 6, len(min(convoIntent))) 
   when  substring(min(convoIntent), 1, 4)  like 'FAIL' then substring(min(convoIntent), 6, len(min(convoIntent))) 
 end as Convo,
sum(case when convoDialogType like 'SUCCESS' then 1 else 0 end) as SuccessNodes,
sum(case when convoDialogType like 'FAIL' then 1 else 0 end) as FailNodes,
sum(case when convoDialogType like 'High_Confidence' then 1 else 0 end) as HighConfNodes,
sum(case when convoDialogType like 'Medium_Confidence' then 1 else 0 end) as MediumConfNodes,
sum(case when convoDialogType like 'Low_Confidence' then 1 else 0 end) as LowConfNodes,
sum(case when convoDialogType like 'No_Confidence' then 1 else 0 end) as NoConfNodes,
sum(convoContainmentScore) as ContainmentScore,
case when sum(convoContainmentScore) > 0 then 'Yes' else 'No' end as Contained

from session_ver3   where convoTS >= convert(datetime,'07/01/2017',101) AND convoTS < convert(datetime,'08/01/2017',101)    group by convoTransID 