[Home](../README.md)

# reports-archiver.script

## Overview

The reports archiver script responsibility is to create empty json files for sftp clients if it's not available and copy .bz2 files for finra clients if it's available.

### config.json
This file is used for configuring the SFTP locations

```json
{
  "sftp_location": {
    "host": "172.24.18.12",
    "port": 22,
    "username": "root",
    "password": "W3!com301",
    "retries": 100,
    "retry_factor": 2,
    "retry_minTimeout": 2000
  },
  "finra_watch_location": {
    "host": "172.24.18.12",
    "port": 22,
    "username": "root",
    "password": "W3!com301",
    "retries": 100,
    "retry_factor": 2,
    "retry_minTimeout": 2000
  },
  "clients": [
    {
      "watch_location_path":"/sftptest/cfgl/upload/cat/",
      "drop_location_path":"/sftptest/cfgl/upload/cat/",
      "crdnumber":"145357",
      "mpid":"RHOX"
    },
    {
      "watch_location_path":"/sftptest/cfgl/upload/cat/",
      "drop_location_path":"/sftptest/cfgl/upload/cat/",
      "crdnumber":"37484",
      "mpid":"GONE"
    },{
      "watch_location_path":"/sftptest/cfgl/upload/cat/",
      "drop_location_path":"/sftptest/cfgl/upload/cattestupload/",
      "crdnumber":"93010",
      "mpid":"SPLN"
    }
  ]
}
```

sftp_location JSON use for do watch and drop location connection for sftp clients. It's also use for do drop location connection for finra clients. finra_watch_location JSON use for do watch location connection for finra clients. clients array contains all clients details for which we want to create files or copy files. watch_location_path contains path where we have to search for the file. drop_location_path contains path where we want to create file or copy file. crdnumber and mpid use for create file name.

## Running the service

```node index.js```

