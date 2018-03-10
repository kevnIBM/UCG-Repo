# Steps to complete
    
# copy setting.js, flows.json, flows_cred.json from Docker/data/ to node-red-docker/data for data-container

# Build command for creating the container for volume mapping via the run command
docker build -f latest/Dockerfile-Data-Volume-Mapped -t dennisnotojr/node-red-docker-node8-nr-18-data-mapped:version-3 .

# Build command for creating the container for volume mapping via the run command and using cluster service
docker build -f latest/Dockerfile-Data-Volume-Mapped-Cluster -t dennisnotojr/node-red-docker-node8-nr-18-data-mapped-cluster:version-3 .

# Build command for creating the container with the data directory copied into the container
docker build -f latest/Dockerfile-Data-In-Container -t dennisnotojr/node-red-docker-node8-nr-17-data-container:version-4 .

# Build command for creating the conatiner with the data directory copied into the container and using cluster service
docker build -f latest/Dockerfile-Data-In-Container-Cluster -t dennisnotojr/node-red-docker-node8-nr-17-data-container-cluster:version-4 .

#Push containers to docker hub
docker push dennisnotojr/node-red-docker-node8-nr-18-data-mapped:version-3
docker push dennisnotojr/node-red-docker-node8-nr-18-data-mapped-cluster:version-3
docker push dennisnotojr/node-red-docker-node8-nr-17-data-container:version-4
docker push dennisnotojr/node-red-docker-node8-nr-17-data-container-cluster:version-4
