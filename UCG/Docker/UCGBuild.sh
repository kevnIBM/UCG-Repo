# Steps to complete
# Refresh the nodered docker source file by copying the github nodered docker source to node-red-docker directory
# copy the docker files from Docker/DockerFiles/* to node-red-docker/latest
# create a directory under node-red-docker called /data
# copy setting.js, flows.json, flows_cred.json from Docker/data/ to node-red-docker/data

# Build command for creating the container for volume mapping via the run command
docker build -f latest/Dockerfile-Volume-Mapped -t dennisnotojr/node-red-docker-node8-nr-17:version-3 .

# Build command for creating the container with the data directory copied into the container
docker build -f latest/Dockerfile-Data-in-Container -t dennisnotojr/nodered-loadtest:version17 .

#Push containers to docker hub
docker push dennisnotojr/node-red-docker-node8-nr-17:version-3
docker push dennisnotojr/nodered-loadtest:version17