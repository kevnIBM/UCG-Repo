
docker build -t dennisnotojr/ucg-web-server:version-1 .

docker push dennisnotojr/ucg-web-server:version-1

docker run -d -v /Users/dennisnoto/Documents/NotoData-Dev/UCG-Repo/UCG/LivePersonBot/node-agent-sdk-master:/code  -p 8080:80  -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/ucg-web-server:version-1