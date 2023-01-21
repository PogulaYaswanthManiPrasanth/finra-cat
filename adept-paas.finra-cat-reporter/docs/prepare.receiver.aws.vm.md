[Home](../README.md)
[Back](./cat.receiver.workflow.md)
### Pre-requisites

* bzip2 linux command
* node.js
* npm
* pm2
* git

## Connecting to the AWS

We need to use a pem file to connect AWS. Ask the administrator for the latest pem file. Make sure before connecting your IP address is whitlisted in the AWS VM. This is the whitelist url manager for aws https://console.aws.amazon.com/ec2/v2/home?region=us-east-1#SecurityGroup:group-id=sg-048d0bc6fe3919b6f.

To connect POC/TEST machine use: centos@ec2-23-20-42-135.compute-1.amazonaws.com

To connect PROD machine use: centos@ec2-3-87-113-169.compute-1.amazonaws.com.

Below is an example command to connect the AWS machine.

```sh
$ ssh -i ./xinthesys-developer.pem centos@ec2-23-20-42-135.compute-1.amazonaws.com

```


### Installation instructions
## Node.js, npm and pm2

```sh
# Add NodeSource yum repository

$ curl -sL https://rpm.nodesource.com/setup_10.x | sudo bash -

$ sudo yum update
$ sudo yum install nodejs
$ sudo yum install npm
$ sudo yum install git
$ npm install -g pm2

$ node -v
$ npm -v
$ pm2 -v
$ git -v

# if bzip2 is not installed use the below command
$ sudo yum update -y
$ sudo yum install -y bzip2

```
## clone adept-pass.finra-cat-receiver

```sh
$ git clone git@gitlab.xinthesys.org:adept/adept-paas/adept-paas.workflows/adept-paas.cat/adept-paas.finra-cat-reciever.git

$ cd adept-paas.finra-cat-receiver
$ npm install

```
## Running the receiver service

```sh
$ pm2 start pm2-cat-receiver.json
$ pm2 ls                                # for verifying if the service is running
```
