SELECT 
convoUser,
convoTS,
convoSource,
convoIntent,
convoDialogNode,
convoDialogType,
convoDialogIntents,
convoDialogEntities,
convoDialogConfidence,
convoContainmentScore,
convoCounter,
convoTransID,
convoUtterance,
REPLACE(convoAnswer,'&#39;','''') as convoAnswer,
REPLACE(REPLACE(convoPayload,'&quot;','"'),'&#39;','') as convoPayload

FROM session_ver3  where convoUser = 'dfn42'  ORDER BY convoTS DESC