# Steps to complete
    
# copy setting.js, flows.json, flows_cred.json from Docker/data/ to node-red-docker/data for data-container

# Build command for creating the container for volume mapping
docker build -f latest/Dockerfile-Data-Volume-Mapped-test -t dennisnotojr/node-red-docker-node9-nr-18-data-mapped:version-7 .

# Build command for creating the container for volume mapping & cluster service
docker build -f latest/Dockerfile-Data-Volume-Mapped-Cluster -t dennisnotojr/node-red-docker-node9-nr-18-data-mapped-cluster:version-7 .

# Build command for creating the container for volume mapping & ML via
docker build -f latest/Dockerfile-Data-Volume-Mapped-ML -t dennisnotojr/node-red-docker-node10-nr-18-data-mapped-ML:version-1 .


# Push containers to docker hub
docker push dennisnotojr/node-red-docker-node9-nr-18-data-mapped:version-7
docker push dennisnotojr/node-red-docker-node9-nr-18-data-mapped-cluster:version-7
docker push dennisnotojr/node-red-docker-node10-nr-18-data-mapped-ML:version-1