# Steps to complete
# May need to Refresh the nodered docker source dir by copying the github nodered docker to node-red-docker directory
    # copy the docker files from Docker/DockerFiles/* to node-red-docker/latest
    # create a directory under node-red-docker called /data
    # copy setting.js, flows.json, flows_cred.json from Docker/data/ to node-red-docker/data

# Build command for creating the container for volume mapping via the run command
docker build -f latest/Dockerfile-Volume-Mapped -t dennisnotojr/node-red-docker-node8-nr-17-data-mapped:version-1 .

# Build command for creating the container for volume mapping via the run command and using cluster service
docker build -f latest/Dockerfile-Volume-Mapped-Cluster -t dennisnotojr/node-red-docker-node8-nr-17-data-mapped-cluster:version-1 .

# Build command for creating the container with the data directory copied into the container
docker build -f latest/Dockerfile-Data-In-Container -t dennisnotojr/node-red-docker-node8-nr-17-data-container:version-1 .

# Build command for creating the conatiner with the data directory copied into the container and using cluster service
docker build -f latest/Dockerfile-Data-In-Container-Cluster -t dennisnotojr/node-red-docker-node8-nr-17-data-container-cluster:version-1 .

#Push containers to docker hub
docker push dennisnotojr/node-red-docker-node8-nr-17-data-mapped:version-1
docker push dennisnotojr/node-red-docker-node8-nr-17-data-mapped-cluster:version-1
docker push dennisnotojr/node-red-docker-node8-nr-17-data-container:version-1
docker push dennisnotojr/node-red-docker-node8-nr-17-data-container-cluster:version-1