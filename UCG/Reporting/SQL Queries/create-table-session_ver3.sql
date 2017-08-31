create table session_ver3 (
convoUser varchar(255),
convoTS datetime,
convoSource varchar(255),
convoIntent varchar(255),
convoDialogNode varchar(255),
convoDialogType varchar(255),
convoDialogIntents varchar(255),
convoDialogEntities varchar(255),
convoDialogConfidence numeric(10,5),
convoContainmentScore int,
convoCounter int,
convoTransID varchar(255),
convoUtterance varchar(255),
convoAnswer varchar(max),
convoPayload varchar(max),
Primary Key (convoUser, convoTS)
)
