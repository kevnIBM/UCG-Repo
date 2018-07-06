
## No need to build a custom container. We leverage node:slim which is nodejs's docker hub container
## UCG was implemented into the Liveperson SDK cluster example
## simpley run the compose file located under the cluster directory

cd /Users/dennisnoto/Documents/NotoData-Dev/UCG-Repo/UCG/LivePersonBot/node-agent-sdk-master/examples/cluster
docker-compose -up 

#or run the kubernetes yaml files with the node-agent-sdk-master as the /code persistant volume



