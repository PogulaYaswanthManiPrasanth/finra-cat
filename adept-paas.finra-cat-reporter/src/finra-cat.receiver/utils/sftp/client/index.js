const Client                            = require("ssh2-sftp-client");
const fs                                = require("fs");

class SFTPClient {

  constructor(_config) {

    this._host = _config.host;
    this._port = _config.port;
    this._username = _config.username;
    this._password = _config.password;

    this.sftpClient = new Client();

  }

  async connect() {

    await this.sftpClient.connect({
      host: this._host,
      port: this._port,
      username: this._username,
      password: this._password,
      retries: 100,
      retry_factor: 2,
      retry_minTimeout: 2000
    });

  }

  async get(_remote, _destination) {

    // let destinationFile = fs.createWriteStream(_destination);
    return this.sftpClient.get(_remote, _destination);

  }

  async list(_path) {

    return await this.sftpClient.list(_path);

  }

  async put() {

      throw "Need to implement";

  }

}

module.exports = SFTPClient;
