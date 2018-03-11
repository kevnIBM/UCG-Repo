# Steps to complete

# Build command for creating the container for volume mapping via the run command
docker build -f latest/Dockerfile-Data-Volume-Mapped -t dennisnotojr/carla-apache-2-php-7-data-mapped:version-1 .
docker build -f latest/Dockerfile-Data-In-Container -t dennisnotojr/carla-apache-2-php-7-data-container:version-1 .



#Push containers to docker hub
docker push dennisnotojr/carla-apache-2-php-7-data-mapped:version-1
docker push dennisnotojr/carla-apache-2-php-7-data-container:version-1

