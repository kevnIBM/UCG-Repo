# Steps to complete
    
# copy setting.js, flows.json, flows_cred.json from Docker/data/ to node-red-docker/data for data-container

# Build command for creating the container for volume mapping via the run command
docker build -f latest/Dockerfile-Data-Volume-Mapped -t dennisnotojr/node-red-docker-node9-nr-18-data-mapped:version-7 .

# Build command for creating the container for volume mapping via the run command and using cluster service
docker build -f latest/Dockerfile-Data-Volume-Mapped-Cluster -t dennisnotojr/node-red-docker-node9-nr-18-data-mapped-cluster:version-7 .

# Build command for creating the container with the data directory copied into the container
docker build -f latest/Dockerfile-Data-In-Container -t dennisnotojr/node-red-docker-node9-nr-18-data-container:version-7 .

# Build command for creating the conatiner with the data directory copied into the container and using cluster service
docker build -f latest/Dockerfile-Data-In-Container-Cluster -t dennisnotojr/node-red-docker-node9-nr-18-data-container-cluster:version-7 .

#Push containers to docker hub
docker push dennisnotojr/node-red-docker-node9-nr-18-data-mapped:version-7
docker push dennisnotojr/node-red-docker-node9-nr-18-data-mapped-cluster:version-7
docker push dennisnotojr/node-red-docker-node9-nr-18-data-container:version-7
docker push dennisnotojr/node-red-docker-node9-nr-18-data-container-cluster:version-7
