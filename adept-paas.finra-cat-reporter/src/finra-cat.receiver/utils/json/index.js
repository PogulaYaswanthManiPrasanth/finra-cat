const fs = require("fs");

async function append(filePath, newData) {
  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, JSON.stringify([]));
  }
  return new Promise((resolve, reject) => {
    fs.readFile(filePath, (err, fileData) => {
      if (err) reject(err);

      let oldData = JSON.parse(fileData);

      oldData = {...oldData, ...newData};
      let updatedData = JSON.stringify(oldData, null, 2);

      fs.writeFile(filePath, updatedData, (err) => {
        if (err) reject(err);
        resolve();
      });
    });
  });
}

async function read(filePath) {
  return new Promise((resolve, reject) => {
    if (fs.existsSync(filePath)) {
      fs.readFile(filePath, (err, data) => {
        if (err) reject(err);
        resolve(JSON.parse(data));
      });
    } else resolve({});
  });
}

module.exports = { read, append };
