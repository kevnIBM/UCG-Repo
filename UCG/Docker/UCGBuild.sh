# Steps to complete
    
# copy setting.js, flows.json, flows_cred.json from Docker/data/ to node-red-docker/data for data-container

# Build command for creating the container for volume mapping via the run command
docker build -f latest/Dockerfile-Data-Volume-Mapped -t dennisnotojr/node-red-docker-node9-nr-18-data-mapped:version-7 .

# Build command for creating the container for volume mapping via the run command and using cluster service
docker build -f latest/Dockerfile-Data-Volume-Mapped-Cluster -t dennisnotojr/node-red-docker-node9-nr-18-data-mapped-cluster:version-7 .

# Push containers to docker hub
docker push dennisnotojr/node-red-docker-node9-nr-18-data-mapped:version-7
docker push dennisnotojr/node-red-docker-node9-nr-18-data-mapped-cluster:version-7
