Welclome to the UCG Repo - Kubernetes Configurations


Steps to use an NFS File storage volume in Bluemix for Kubernetes Persistant Volume

1. Create an NFS File storage volume
   Catalog - Storage - File Storage
   Select Performance, Dallas-10, 40 GB, 100 IOPS

2. Create a Centos VM for managing files on NFS
   Catalog - Compute - Virtual Server
   Select Public VM, Centos, balanced 2x4, Public and Private Network Uplink, add-on static IP

3. Authorize NFS for Centos server and the Cluster Works
   Go into Infrastructure - Storage - File Storage - Select the NFS volume
   Authorize VM servers

4. Mount NFS on Centos server
   Install nfs 
        yum -y install nfs-utils nfs-utils-lib
   Mount nfs
       mount -t nfs4 -o hard,intr fsf-dal1001f-fz.adn.networklayer.com:/IBM02SV1339641_1/data01 /mnt
      - mount_point can be found at step 3
   Test to see if mounted
        df -h
5. create directores and copy files
     - create directory for data and code
       cd /mnt
       mkdir data - for nodered 
       mkdir code - liveperson

     - use scp or filezilla to copy files
       for /data
           - copy settings.js, flows.json, flows-cred.json
       for /code
           - copy /examples directory to /code - tar first, then copy, and untar
     - unsecure files 
       chmod 777 -R data
       chmod 777 -R code

 6. update the kubernetes volume.yaml with Server and path info

 7. create volume and volume claim
      ./kubectl create -f volume.yaml
      ./kubectl apply -f volume-claim.yaml

 8. Now you can use the nodered-deployment-data-mapped-cloud.yaml













