const csv                               = require("csvtojson");

let csvData = null;

async function getCSV(csvFilePath) {

  if (csvData == null) {

    csvData = await csv().fromFile(csvFilePath);

  }

  return csvData;

}

module.exports = getCSV;
