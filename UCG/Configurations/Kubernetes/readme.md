Installing on AWS

Can’t use root user account to create cluster, created EKS-Admin user

Create a user EKS-Admin with right permissions for EC2, EKS, etc.

Follow "getting started" guide - https://docs.aws.amazon.com/eks/latest/userguide/getting-started.html

  Create an Amazon EKS Service Role for backplane communications for cluster and workers
  
  Create a VPC for communications for cluster and workers
  
  Install/config aws cli, kubectl and hecto-authenticator and create kube-config file

Create cluster

aws eks create-cluster --name UCG --role-arn arn:aws:iam::745237701626:role/EKS-Role --resources-vpc-config subnetIds=subnet-bf7033f5,subnet-7395292f,securityGroupIds=sg-1889f552

Create workers
CloudFormation -use this template -  https://amazon-eks.s3-us-west-2.amazonaws.com/1.10.3/2018-06-05/amazon-eks-nodegroup.yaml

Connect workers to cluster

Get aws-auth-cm.yml 

        curl -O https://amazon-eks.s3-us-west-2.amazonaws.com/1.10.3/2018-06-05/aws-auth-cm.yaml

and Replace the <ARN of instance role (not instance profile)> snippet with the NodeInstanceRole value that you recorded in the previous procedure, and save 

./kubectl apply -f aws-auth-cm.yaml

How you can watch your workes join the cluster
./kubectl get nodes --watch


Add Dashboard

Get the dashboard yaml 

curl -O  https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
Add  --token-ttl=0 under the args 

./kubectl apply -f https://raw.githubusercontent.com/kubernetes/dashboard/master/src/deploy/recommended/kubernetes-dashboard.yaml
./kubectl apply -f https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/influxdb/heapster.yaml
./kubectl apply -f https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/influxdb/influxdb.yaml
./kubectl apply -f https://raw.githubusercontent.com/kubernetes/heapster/master/deploy/kube-config/rbac/heapster-rbac.yaml
./kubectl apply -f eks-admin-serviceaccount.yaml
./kubectl apply -f eks-admin-clusterrolebinding.yaml

Get Token for dashboard
./kubectl -n kube-system describe secret $(./kubectl -n kube-system get secret | grep eks-admin | awk '{print $1}')

 -- Finds eks-admin-token 

export KUBECONFIG=kube-config-dev
— for kubectl commands

START DASHBOARD
./kubectl --kubeconfig=kube-config-dev proxy --port 8003 </dev/null &>/dev/null &

http://localhost:8003/api/v1/namespaces/kube-system/services/https:kubernetes-dashboard:/proxy/ 

Create EFS service and Centos EC2(T1) to manage data directories
—  Make sure you use the VPC created for cluster

MUST do a YUM install of EFS utils on every NODE to get the efs-provisioner to work!!!  
sudo yum install -y amazon-efs-utils - workers
sudo apt-get install nfs-common - centos nfs server

Need to add the EFS provisioner for persistent EFS volumes
https://github.com/kubernetes-incubator/external-storage/tree/master/aws/efs

First - permissions 
./kubectl create -f deploy/auth/serviceaccount.yaml
./kubectl create -f deploy/auth/clusterrole.yaml
./kubectl create -f deploy/auth/clusterrolebinding.yaml

Add efs provisioner
./kubectl create -f efs-provisioner-deployment.yaml
  -- make sure you change these values: 
       file.system.id: fs-3249457a
       aws.region: us-east-1
       nfs:
            server: fs-3249457a.efs.us-east-1.amazonaws.com
            path: /

Add nodered deployment 
Add nodered service


