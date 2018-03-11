
#Run command for container with data volume mapped
docker run -d -v /Users/dennisnoto/Documents/NotoData-Dev/Carla/htdocs:/opt/htdocs  -p 80:80  -p 443:443 -e WEB_DOCUMENT_ROOT=/opt/htdocs/  dennisnotojr/carla-apache-2-php-7-data-mapped:version-1


#Run command for container with data in the container and logging to syslog
 docker run -d -p 1880:1880  \
    --log-driver syslog \
    --log-opt tag="{{ (.ExtraAttributes nil).appName }}" \
    --log-opt env=appName \
    -e appName=NodeRed -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 \
    dennisnotojr/carla-apache-2-php-7-data-mapped:version-1
