Live Person Configuration

In Live Person System

1. Create a bot skill
    - name: watson-bot
    - description: watson-bot
    - Transfer to Skills - check conversation assigned to skill can be transferred
         all skills
   Grab the bot skill id from the end of the url: https://z1.le.liveperson.net/a/58892698/#um!skills/292626214

2. Create an escalation skill
    - name: escalation-agent
    - description: Agent to handle Watson Escalations
    - Transfer to Skills - check conversation assigned to skill can be transferred
         all skills
   Grab the escalation skill id from the end of the url: https://z1.le.liveperson.net/a/58892698/#um!skills/289011314


3. Create a user Watson
	- type : HUMAN
	- Login Name, nick name, name : Watson
	- Picture url : https://www.ibm.com/developerworks/community/blogs/ibmandgoogle/resource/BLOGS_UPLOADED_IMAGES/IBM_Watson_logo_square.png
	- login metho : password Hockey1234
	- Assignment : Agent
	- Max no. Live chat: unlimited
	- Max no. messaging conversations: 20
	- skill : watson-bot (must be created before setting)

	Grab the user id from the end of the url: le.liveperson.net/a/58892698/#um!users/292625314

4. Create a user for a live agent escalation
    - type : human
	- Login Name, nick name, name : xxx
	- Picture url : xxx.png/jpeg
	- login metho : password xxxxx
	- Assignment : Agent
	- Max no. Live chat: unlimited
	- Max no. messaging conversations: 20
	- skill : escalation-agent (must be created before setting)

3. Create a campaign

   - campaign goal : interact with customers
   - target: all visits
   - engagement
     -  Creative:Slide-out chat banner
     - Language:English (US)
     - Requires authentication:Yes
     - Conversation type:Messaging
     - ENGAGEMENT WINDOW : Ocean Theme
     - LOCATION : set the contains to ucg-xxx which will be the webpage name
     - VISITOR BEHAVIOR : All behaviors (recommended)

   Grab the campaign id from the end of the url: https://z1.le.liveperson.net/a/58892698/#camp!campaigns/web/292629814

4. generate a jwt - https://generatejwt.herokuapp.com
      customer id : UCG
      customer type : IBM-Watson
      email address : xx
      Given name: xxx
      last name : xxx

5. Send email to liveperson to set up message routing
      account id: 58892698
      bot skill id: 292626214
      escalation skill id: 289011314
      campaign id: 292629814
      jwt : eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJVQ0ciLCJnaXZlbl9uYW1lIjoiZGVubmlzIiwiZmFtaWx5X25hbWUiOiJub3RvIiwiZW1haWwiOiJkZW5uaXMubm90b0B1cy5pYm0uY29tIiwibHBfc2RlcyI6W3sidHlwZSI6ImN0bXJpbmZvIiwiaW5mbyI6eyJjdHlwZSI6IklCTS1XYXRzb24ifX1dLCJpc3MiOiJodHRwczovL3d3dy5saXZlcGVyc29uLmNvbSIsImlhdCI6MTUwODUxMzk3NTE3NCwiZXhwIjoxNTQwMDUzOTc1MTc0fQ.YYGqu6Lh-1XsJEa9pn1pUTupOVaLjLzWdquWo78v6nBWpep6zZuWzZTXx4O3tGQmwh2WpvpDoIxrzxm0mZSO80ItXEDeRHO6BcsAri_gRWaR7UWblYiUo7GjTJzw2YN9uZwa6A9lnuCU_CDrsh0aMZVdZj8nsLusH9OKJmzSEUY

In Kubernetes Custer

1. Set up an nfs share and authorize the cluster workers, see https://github.com/dennisnotojr/UCG-Repo/tree/master/UCG/Configurations/Kubernetes readme

2. create volume and volume-claim
   ./kubectl create -f volume-code.yaml
   ./kubectl create -f volume-claim-code.yaml

3. create LivePerson Pod
   ./kubectl create -f liveperson-pod.yaml

