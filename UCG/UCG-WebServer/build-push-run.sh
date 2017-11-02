
docker build -t dennisnotojr/ucg-web-server:version-1 .

docker push dennisnotojr/ucg-web-server:version-1

docker run -d -p 3000:3000  -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/dennisnotojr/ucg-server:version-1