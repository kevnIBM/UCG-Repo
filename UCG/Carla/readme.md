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

carla-docker directory - used to create create a apache/php docker container







