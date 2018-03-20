CARLA Intergation


Repo Directory Structure

Main Directory
- Kubernetes Directory - files to create a volume, deployment, service in a kubernetes cluster

- docker-compose.yml - raises both UCG and Carla bound to the same network
     - Requirements
         - repoint volume config to the data directory for UCG
         - obtain a licensed copy of Carla and create an htdocs directory and repoint volume config
         - Launch the NodeRed Console and change the ip address to the host's ip in the "Get Answer Flow"-"Carla Node" and wire it to replace WCS

- carlaBuild - build and push commands - must be on the carla-docker directory when issuing the command

- carlaRun - run command to raise only the carla container

- carla-docker directory - used to create a apache/php docker container

  - htdocs directory - volume mapped to docker container for persistent apache content storage


  -latest - contains the docker files for build 

Run-time notes 

For Omni-Channel front-ends, set username and password to ' ', workspace to the Carla workspace_id and add carla_host=<host ip or kubernetes domain> as param

In the "Get Answer" subflow, edit the Carla function node:
	Alter the Url var:

 	 - Change the IP 
      - to the host computer IP if on-prem or 
      - to the domain name of the Kubernetes cluster if cloud 

Example calling UCG Load flow 

- On-prem
  http://localhost:1880/load?user_id=testmeplease15&wcs_username=' '&wcs_password=' '&workspace_id=54141f49-ffa2-4f6b-887c-aac6aea5d42d&text='status of my claim'&fname=dennis&carla_host=localhost

- In Kubernetes cluster

  http://ucg-clusterdev.us-south.containers.mybluemix.net/load?user_id=testmeplease15&wcs_username=' '&wcs_password=' '&workspace_id=54141f49-ffa2-4f6b-887c-aac6aea5d42d&text='status of my claim'&fname=dennis&carla_host=ucg-clusterdev.us-south.containers.mybluemix.net



