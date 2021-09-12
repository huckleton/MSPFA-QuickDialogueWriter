const fs = require("fs");

function generateFile(contents, operation, fileType = "txt") {
  let currentDate = new Date()
      month = '' + (currentDate.getMonth() + 1),
      day = '' + currentDate.getDate(),
      year = currentDate.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  let calDate = [year, month, day].join('');
  let calTime = currentDate.toLocaleTimeString("en-GB").replace(/:/g,'');
  let fileName = "../output/" + operation + "_" + calDate + "-" + calTime + "." + fileType;

  fs.writeFileSync(fileName, contents);
}

exports.gen = generateFile;
