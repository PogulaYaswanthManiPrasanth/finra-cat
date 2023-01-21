# AWS Provate Link to FINRA CAT Testing Environment

## Connecting to AMAZON EC2 instance via ssh

```
$ chmod 400 xinthesys-developer.pem 
$ ssh -i "xinthesys-developer.pem" ec2-user@ec2-18-232-161-162.compute-1.amazonaws.com
```
# Connecting to FINRA SFTP Through Xinthesys EC2 instance


## FTP Account 

userid: cat93010ftp
password: W3!com3_93010 

## Connect manually to FINRA SFTP endpoint

```
sftp cat93010ftp@sftp-pl.ct.catnms.com
```
