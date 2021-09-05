const fs = require("fs");
const nameData = require("./names.json");
const dialoguePath = "./dialogue.txt";


function convertDialogue() {
  let dialogue = fs.readFileSync(dialoguePath).toString().split("\r\n");
  let newDialogue = "";

  for (let l = 0; l < dialogue.length; l++) {
    newDialogue += applyNameDataToLine(dialogue[l]);
    newDialogue += "\n";
  }

  generateFile(newDialogue);
}


function applyNameDataToLine(line) {
  // get "character data" from our json file
  let lineParts = line.split(":");
  let charData = nameData[lineParts[0].trimEnd()];
  if (!charData) return line;

  //  strings to format into the dialogue
  let l = {
    name: charData.replaceName ? charData.replaceName : lineParts[0].trimEnd(),
    speech: lineParts[1] ? lineParts[1].trimStart() : "",
    separator: charData.separator ? charData.separator + " " : ": ",
    nPre: "",
    nSuf: "",
    sPre: "",
    sSuf: "",
    dPre: "",
    dSuf: ""
  }

  // bbcode tags
  if (charData.bbTags && Array.isArray(charData.bbTags)) {
    for (let t = charData.bbTags.length - 1; t >= 0; t--) {
      let tagParams = charData.bbTags[t].split(" ");
      l.nPre = `[${charData.bbTags[t]}]` + l.nPre;
      l.nSuf += `[/${tagParams[0]}]`;
    }
  }
  // html tags
  if (charData.htmlTags && Array.isArray(charData.htmlTags)) {
    for (let t = charData.htmlTags.length - 1; t >= 0; t--) {
      let tagParams = charData.htmlTags[t].split(" ");
      l.nPre = `<${charData.htmlTags[t]}>` + l.nPre;
      l.nSuf += `</${tagParams[0]}>`;
    }
  }

  // colors
  if (charData.textColor && charData.color) {
    l.nPre = `[color=${charData.color}]` + l.nPre;
    l.nSuf += `[/color]`;
    l.sPre = `[color=${charData.textColor}]` + l.sPre;
    l.sSuf += `[/color]`;
  }
  else if (charData.color) {
    l.dPre = `[color=${charData.color}]` + l.dPre;
    l.dSuf += "[/color]";
  }

  // classes
  if (charData.nameClass) {
    l.nPre = `<span class="${charData.nameClass}">` + l.nPre;
    l.nSuf += `</span>`;
  }
  if (charData.textClass) {
    l.sPre = `<span class="${charData.textClass}">` + l.sPre;
    l.sSuf += `</span>`;
  }
  if (charData.dialogueClass) {
    l.dPre = `<span class="${charData.dialogueClass}">` + l.dPre;
    l.dSuf += "</span>";
  }

  // return our new dialogue
  let outputName = l.nPre + l.name + l.nSuf;
  let outputSpeech = l.speech ? l.sPre + l.separator + l.speech + l.sSuf : "";
  return l.dPre + outputName + outputSpeech + l.dSuf;
}


function generateFile(contents) {
  let currentDate = new Date()
      month = '' + (currentDate.getMonth() + 1),
      day = '' + currentDate.getDate(),
      year = currentDate.getFullYear();
  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  let calDate = [year, month, day].join('');
  let calTime = currentDate.toLocaleTimeString("en-GB").replace(/:/g,'');
  let fileName = "./" + calDate + "-" + calTime + ".txt";

  fs.writeFileSync(fileName, contents);
}


convertDialogue();
