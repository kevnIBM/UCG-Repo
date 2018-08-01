
docker run -d -v /Users/dennisnoto/Documents/NotoData-Dev/UCG-Repo/UCG/UCG-WebServer/ucg-web-server:/code  -p 8080:80  -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/ucg-web-server-data-mapped:version-1

docker run -d -p 8080:80  -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/ucg-web-server-data-mapped:version-1