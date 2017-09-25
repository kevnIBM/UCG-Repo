#!/bin/sh
#Installation Instructions for local Kubernetes Cluster and Node JS deployment
#Assumption: Clean CentOS 7 image with 4GB RAM, 4 cores and 25GB Hardisk,
#Login as root

#Install Docker, etcd, and kubernetes
yum install docker etcd kubernetes

@Start Docker services 
for SERVICE in docker etcd kube-apiserver kube-controller-manager kube-scheduler kube-proxy kubelet; do
    systemctl restart $SERVICE
    systemctl enable $SERVICE
done
#
vi /etc/sysconfig/docker
#Fix docker startup by removing —selunix-enabled param from the /etc/sysconfig/docker

#install Kubernetes Cockpit 
yum install cockpit cockpit-kubernetes
@Start Cokpit services
systemctl enable cockpit.socket
systemctl start cockpit.socket

#Stop and disable firewalld - not compadable with kubenetes - use iptables 
systemctl stop firewalld
systemctl disable firewalld
#REBOOT

#Browse to cockpit UI -> https://server_ip:9090 to see cluster
 
#These steps are not necessary due to the fact that kubect is installed with the yum Kubernetes install and the repo has a copy located in the Kubernetes directory
#Install kubctl for kubernetes command control
#curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
#chmod +x ./kubectl #move to your standard bin directory

#Kubernetes uses certificates to authenticate API request. Before configuring API server, we need to generate certificates that can be used for authentication. 
#Kubernetes provides ready made scripts for generating these certificates which can be found https://github.com/kubernetes/kubernetes/blob/master/cluster/saltbase/salt/generate-cert/make-ca-cert.sh
#Download this script and update - cert_group=${CERT_GROUP:-kube}
# update the below line with the group that exists on Kubernetes Master.
/* Use the user group with which you are planning to run kubernetes services */
cert_group=${CERT_GROUP:-kube}
#Now, run the script with following parameters to create certificates:
bash make-ca-cert.sh "127.0.0.1" "IP:127.0.0.1,IP:10.254.0.1,DNS:kubernetes,DNS:kubernetes.default,DNS:kubernetes.default.svc,DNS:kubernetes.default.svc.cluster.local"

#In /etc/kubernetes/apiserver - change
vi /etc/kubernetes/apiserver

KUBE_ADMISSION_CONTROL="--admission-control=NamespaceLifecycle,NamespaceExists,LimitRanger,SecurityContextDeny,ServiceAccount,ResourceQuota"
 
#Add 
KUBE_API_ARGS="--runtime-config=extensions/v1beta1/deployments=true,extensions/v1beta1/daemonsets=true --client-ca-file=/srv/kubernetes/ca.crt --tls-cert-file=/srv/kubernetes/server.cert --tls-private-key-file=/srv/kubernetes/server.key"
#Retart API Server
systemctl restart kube-apiserver 

#In /etc/kubernetes/controler-manager - changes
vi /etc/kubernetes/controller-manager
#Add
KUBE_CONTROLLER_MANAGER_ARGS="--root-ca-file=/srv/kubernetes/ca.crt --service-account-private-key-file=/srv/kubernetes/server.key"
#Retart Controller Manager
systemctl restart kube-controller-manager 

#Download latest UCG Docker repository to root's home directory 
cd /root
#Download UCG project https://github.com/dennisnotojr/UCG-Repo into /data folder as zip file
unzip UCG-Repo-master.zip
@Go to Kubernetes configuration folder
		
#Enable read/write access for all users and groups, run the following 
chmod -R a+rwX /root/UCG-Repo-master/UCG/Docker/data

#In Cockpit
#- Create 127.0.0.1 NODE if one is not present COMMENT: There should be a default node which can be used
#Go to Kubernetes configuration folder 

cd /root/UCG-Repo-master/UCG/Configurations/Kubernetes

vi nodered-service-onPrem.yaml and ingress-controller-onPrem
#Change externalIPs section and replace IP address with the public IP address (e.g. 192.168.32.129)
    externalIPs:
     -  192.168.32.129
     
#Run Kubectl commands
#create persistant volume that all containers will use
kubectl create -f nodered-volume-onPrem.yaml
#create the claim on the volume
kubectl create -f nodered-volume-claim.yaml
#create the deployment
kubectl create -f nodered-deployment-onPrem.yaml
#apply the Load Balancing service
kubectl apply -f nodered-service-onPrem.yaml
# Creating an ingress controller
# First create te backend http server and kube service for 404s 
kubectl create -f backend-http-onPrem.yaml
# Second create the ingress controller and service
kubectl create -f ingress-controller-onPrem.yaml

# Check that Kubernetes components are running in Cockpit or kubectl
kubectl describe pv
kubectl describe pvc
kubectl describe svc

#Test the API
Using postman on an external web browser, test this URL (POST)
http://192.168.32.129:1880/load?user_id=ok123workspace_id=a003413f-2973-4dba-b1ba-550b3fa09a71&text='yes'&fname=dennis 
The service should return a Watson message

