
#Run command for container with data volume mapped
docker run -d -v /Users/dennisnoto/Documents/NotoData-Dev/Carla/carla-docker/htdocs:/opt/htdocs  -p 80:80  -p 443:443 -e WEB_DOCUMENT_ROOT=/opt/htdocs/  dennisnotojr/carla-apache-2-php-7-data-mapped:version-1


#Run with logging to syslog
docker run -d -v /Users/dennisnoto/Documents/NotoData-Dev/Carla/carla-docker/htdocs:/opt/htdocs  -p 80:80  -p 443:443  \
    --log-driver syslog \
    --log-opt tag="{{ (.ExtraAttributes nil).appName }}" \
    --log-opt env=appName \
    -e appName=Carla -e \
    dennisnotojr/carla-apache-2-php-7-data-mapped:version-1
