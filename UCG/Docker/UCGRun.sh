
#Run command for container with data volume mapped
docker run -d -v /Users/dennisnoto/Documents/NotoData-Dev/UCG-Repo/UCG/Docker/data:/data  -p 1880:1880  -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/node-red-docker-node8-nr-17-data-mapped:version-5

#Run command for container with data volume mapped and cluster
docker run -d -v /Users/dennisnoto/Documents/NotoData-Dev/UCG-Repo/UCG/Docker/data:/data  -p 1880:1880  -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/node-red-docker-node8-nr-17-data-mapped-cluster:version-5

#Run command for container with data in the container
docker run -d -p 1880:1880  -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/node-red-docker-node8-nr-17-data-container:version-4

#Run command for container with data in the container and cluster
docker run -d -p 1880:1880  -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/node-red-docker-node8-nr-17-data-container-cluster:version-4

#Run command for container with data in the container and logging to syslog
 docker run -d -p 1880:1880  \
    --log-driver syslog \
    --log-opt tag="{{ (.ExtraAttributes nil).appName }}" \
    --log-opt env=appName \
    -e appName=NodeRed -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 \
    dennisnotojr/node-red-docker-node8-nr-17-data-mapped-cluster:version-1
