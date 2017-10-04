
#Run command for container with data volume mapped
docker run -d -v /Users/dennisnoto/Documents/NotoData-Dev/UCG-Repo/UCG/Docker/data:/data  -p 1880:1880  -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/node-red-docker-node8-nr-17:version-3

#Run command for container with data in the container
docker run -d -p 1880:1880  -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/nodered-loadtest:version17
