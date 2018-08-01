
docker build -f latest/Dockerfile-Data-Volume-Mapped -t dennisnotojr/ucg-web-server-data-mapped:version-1 .

docker build -f latest/Dockerfile-Data-In-Container -t dennisnotojr/ucg-web-server-data-container:version-1 .

docker push dennisnotojr/ucg-web-server-data-mapped:version-1 
docker push dennisnotojr/ucg-web-server-data-container:version-1
 