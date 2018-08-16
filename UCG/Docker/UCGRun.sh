
#Run command for container with data volume mapped
docker run -d -v /Users/dennisnoto/Documents/NotoData-Dev/UCG-Repo/UCG/Docker/data:/data  -p 1880:1880  -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/node-red-docker-node9-nr-18-data-mapped:version-7

#Run command for container with data volume mapped and cluster
docker run -d -v /Users/dennisnoto/Documents/NotoData-Dev/UCG-Repo/UCG/Docker/data:/data  -p 1880:1880  -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/node-red-docker-node9-nr-18-data-mapped-cluster:version-7

#Run command for container with data volume mapped with ML
docker run -d -v /Users/dennisnoto/Documents/NotoData-Dev/UCG-Repo/UCG/Docker/data:/data  -p 1880:1880  -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/node-red-docker-node10-nr-18-data-mapped-ML:version-1

#Run command for container with data volume mapped and logging to syslog
 docker run -d -v /Users/dennisnoto/Documents/NotoData-Dev/UCG-Repo/UCG/Docker/data:/data  -p 1880:1880  \
    --log-driver syslog \
    --log-opt tag="{{ (.ExtraAttributes nil).appName }}" \
    --log-opt env=appName \
    -e appName=NodeRed -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 \
    dennisnotojr/node-red-docker-node9-nr-18-data-mapped-cluster:version-7
