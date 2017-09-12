#!/bin/sh
#assumes all files for this script on present on this directory
#assumes kubectl is moved to this directory
#assumes you installed the kubernetes cli after installing the cluster via bluemix.
#assumes that the nodered docker image is on docker hub.

#DCOS install
     #Goto the bluemix catalog and click on kubernetes service
     #     Select Paid service and set the name, number of workers, and the micro machine footprint
     # Config Note - change the ingress file with your cluster host
     # Config Note - change the deployment file to set replicas to the number of workers that you created

     

#assumes you set the configuration to your cluster via the steps definied in installing kuberctl for bluemix

#configure storage
./kubectl create -f nodered-volume-onPrem.yaml
#configure storage claim
./kubectl create -f nodered-volume-claim-onPrem.yaml
#configure the deployment
./kubectl create -f nodered-deployment-onPrem.yaml
#configure the service
./kubectl apply -f nodered-service-onPrem.yaml
#configure ingress 
./kubectl apply -f ingress-onPrem.yaml

#Start Dashboard service locally which will connect to the bluemix cluster
./kubectl proxy

#Goto Web dashboard in your browser
#     http://localhost:8001/ui

