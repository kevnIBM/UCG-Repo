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
 
#OK: These steps are not necessary due to the fact that kubect is installed with the yum Kubernetes install:
#Install kubctl for kubernetes command control
#curl -LO https://storage.googleapis.com/kubernetes-release/release/$(curl -s https://storage.googleapis.com/kubernetes-release/release/stable.txt)/bin/linux/amd64/kubectl
#chmod +x ./kubectl and move to where ever

vi /etc/kubernetes/apiserver
 #In /etc/kubernetes/apiserver - change

KUBE_ADMISSION_CONTROL="--admission-control=NamespaceLifecycle,NamespaceExists,LimitRanger,SecurityContextDeny,ServiceAccount,ResourceQuota"
#To
KUBE_ADMISSION_CONTROL=""
 
#Add 
KUBE_API_ARGS="--runtime-config=extensions/v1beta1/deployments=true,extensions/v1beta1/daemonsets=true"
#Retart API Server
systemctl restart kube-apiserver kube-controller-manager
 
#Download latest UCG Docker repository 
mkdr /data
cd /data
#Download UCG project https://github.com/dennisnotojr/UCG-Repo into /data folder as zip file
unzip UCG-Repo-master.zip
@Go to Kubernetes configuration folder
		
#Download version-1 UCG image
docker run -v /data/UCG-Repo-master/UCG/Docker/data:/data -p 1880:1880 -e NODE_ENV=production -e NODE_OPTIONS=--max_old_space_size=1024 dennisnotojr/node-red-docker-node8-nr-17:version-2

#Enable read/write access for all users and groups, run the following 
chmod -R a+rwX /data/UCG-Repo-master/UCG/Docker/data

#In Cockpit
#- Create 127.0.0.1 NODE    COMMENT: There should be a default node which can be used
#Go to Kubernetes configuration folder 

cd /data/UCG-Repo-master/UCG/Configurations/Kubernetes

#External IP Addrees fix. not everyone may need this, but some people may. You can run the Kube below commands w/o the fix and check the kubectl get servises command shows an external IP address. If it doesn't, apply the change to the yaml file
vi nodered-service-onPrem.yaml
#Uncomment the externalIPs section and replace IP address with the public IP address (e.g. 192.168.32.129)
    externalIPs:
     -  192.168.32.129

#Run Kube Ctl commands
kubectl create -f nodered-volume-onPrem.yaml
kubectl create -f nodered-volume-claim.yaml
kubectl create -f nodered-deployment-onPrem.yaml
kubectl apply -f nodered-service-onPrem.yaml

# Check that node and containers are running in Cockpit or kubectl
kubectl get nodes
kubectl describe pv
kubectl describe pvc
kubectl describe svc

#Test the API
Using postman on an external web browser, test this URL (POST)
http://192.168.32.129:1880/load?user_id=ok123workspace_id=a003413f-2973-4dba-b1ba-550b3fa09a71&text='yes'&fname=dennis 
The service should return a Watson message

