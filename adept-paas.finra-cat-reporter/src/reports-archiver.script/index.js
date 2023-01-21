const moment = require('moment');
const Client = require('ssh2-sftp-client');
let sftpLocationConnection = finraWatchLocationConnection = null;

const config = require('./config.json');

sftpConnection();

function sftpConnection(){
  sftpLocationConnection = new Client();
  sftpLocationConnection.connect(config.sftp_location).then(() => {
    finraWatchLocationConnection = new Client();
    finraWatchLocationConnection.connect(config.finra_watch_location).then(() => {
      callFileWatcher(0);
    }).catch(err => {
      console.log("sftpConnection >> finraWatchLocationConnection >> err >> ", err);
    });
  }).catch(err => {
    console.log("sftpConnection >> sftpLocationConnection >> err >> ", err);
  });
}

function callFileWatcher(clientIndex){
  fileWatcher(config.clients[clientIndex], function(){
    if(typeof config.clients[clientIndex+1] != "undefined"){
      callFileWatcher(clientIndex+1);
    }else{
      process.exit();
    }
  });
}



function fileWatcher(clientDetail, callback) {
  try{
    const connectionObj = (clientDetail.mpid == "RHOX" || clientDetail.mpid == "GONE" || clientDetail.mpid == "CTCA") ? sftpLocationConnection : finraWatchLocationConnection;
    connectionObj.list(clientDetail.watch_location_path).then(arrFilelist => {
      let currentDate = moment().format("YYYYMMDD");
      let index = -1;
      for (let intNewFileIndex in arrFilelist) {
        if(arrFilelist[intNewFileIndex].name.indexOf(currentDate) != -1 && arrFilelist[intNewFileIndex].name.indexOf('.bz2') != -1){
          index = intNewFileIndex;
          break;
        }
      }
      if(index == -1){
        if(clientDetail.mpid == "RHOX" || clientDetail.mpid == "GONE" || clientDetail.mpid == "CTCA"){
          console.log("fileWatcher >> file not available for today so create it for sftp clients >> mpid >> ", clientDetail.mpid);
          let fileName = `${clientDetail.crdnumber}_${clientDetail.mpid}_${currentDate}_OrderEvents_000001.json`;
          createFile(clientDetail, fileName, Buffer.from('', 'utf8'), function(){
            return callback();
          });
        }else{
          console.log("fileWatcher >> file not available for today but no need to create it for finra clients >> mpid >> ", clientDetail.mpid);
          return callback();
        }
      }else{
        if(clientDetail.mpid != "RHOX" && clientDetail.mpid != "GONE" && clientDetail.mpid != "CTCA"){
          console.log("fileWatcher >> file available for today so copy it for finra clients >> mpid >> ", clientDetail.mpid);
          let fileName = arrFilelist[index].name;
          const remotePath = clientDetail.watch_location_path + fileName;
          connectionObj.get(remotePath, undefined).then((buffer) => {
            createFile(clientDetail, fileName, buffer, function(){
              return callback();
            });
          }).catch(err => {
            console.log("fileWatcher >> get >> err >> ", err);
          });
        }else{
          console.log("fileWatcher >> file available for today but no need to copy it for sftp clients >> mpid >> ", clientDetail.mpid);
          return callback();
        }
      }
    }).catch(err => {
      console.log("fileWatcher >> list >> err >> ", err);
    });
  }catch(err){
    console.log("fileWatcher >> err >> ", err);
  }
}

function createFile(clientDetail, fileName, buffer, callback){
  try{
    const remotePath = clientDetail.drop_location_path + fileName;
    sftpLocationConnection.put(buffer, remotePath).then(() => {
      return callback();
    }).catch(err => {
      console.error(err.message);
    });
  }catch(err){
    console.log("createFile >> err >> ", err);
  }
}
