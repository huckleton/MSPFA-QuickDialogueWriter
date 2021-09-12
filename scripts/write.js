const fs = require("fs");
const writeToFile = require("./writeToFile");
const nameData = require("../input/names.json");
const inputPath = "../input/dialogue.txt";


function convertDialogue() {
  let dialogue = fs.readFileSync(inputPath).toString().split("\r\n");
  let newDialogue = "";

  for (let l = 0; l < dialogue.length; l++) {
    newDialogue += applyNameDataToLine(dialogue[l]);
    newDialogue += "\n";
  }

  writeToFile.gen(newDialogue, "dialogue");
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

  // format tags
  // names
  l = formatBB("name", "n", charData, l);
  l = formatHTML("name", "n", charData, l);
  l = formatBB("dialogue", "d", charData, l);
  l = formatHTML("dialogue", "d", charData, l);
  l = formatBB("speech", "s", charData, l);
  l = formatHTML("speech", "s", charData, l);

  // colors
  l = formatColor("name", "n", charData, l);
  l = formatColor("dialogue", "d", charData, l);
  l = formatColor("speech", "s", charData, l);

  // classes
  l = formatClass("name", "n", charData, l);
  l = formatClass("dialogue", "d", charData, l);
  l = formatClass("speech", "s", charData, l);

  // return our new dialogue
  let outputName = l.nPre + l.name + l.nSuf;
  let outputSpeech = l.speech ? l.sPre + l.separator + l.speech + l.sSuf : "";
  return l.dPre + outputName + outputSpeech + l.dSuf;
}


// bbcode tags, in the form [tag]
function formatBB(section, sectAbbr, data, l) {
  let dataIndex = section + "bbTags";
  let pref = sectAbbr + "Pre";
  let suff = sectAbbr + "Suf";

  if (data[dataIndex] && Array.isArray(data[dataIndex])) {
    for (let t = data[dataIndex].length - 1; t >= 0; t--) {
      let tagParams = data[dataIndex][t].split(/\s=/g);
      l[pref] = `[${data[dataIndex][t]}]` + l[pref];
      l[suff] += `[/${tagParams[0]}]`;
    }
  }

  return l;
}


// html tags, in the form <tag>
function formatHTML(section, sectAbbr, data, l) {
  let dataIndex = section + "htmlTags";
  let pref = sectAbbr + "Pre";
  let suff = sectAbbr + "Suf";

  if (data[dataIndex] && Array.isArray(data[dataIndex])) {
    for (let t = data[dataIndex].length - 1; t >= 0; t--) {
      let tagParams = data[dataIndex][t].split(/\s=/g);
      l[pref] = `<${data[dataIndex][t]}>` + l[pref];
      l[suff] += `</${tagParams[0]}>`;
    }
  }

  return l;
}


// color tags, outside the tags
function formatColor(section, sectAbbr, data, l) {
  let dataIndex = section + "Color";
  let pref = sectAbbr + "Pre";
  let suff = sectAbbr + "Suf";

  if (data[dataIndex]) {
    l[pref] = `[color=${data[dataIndex]}]` + l[pref];
    l[suff] += `[/color]`;
  }

  return l;
}


// classes, encompassing everything
function formatClass(section, sectAbbr, data, l) {
  let dataIndex = section + "Class";
  let pref = sectAbbr + "Pre";
  let suff = sectAbbr + "Suf";

  if (data[dataIndex]) {
    l[pref] = `<span class="${data[dataIndex]}">` + l[pref];
    l[suff] += `</span>`;
  }

  return l;
}


// bootstrap
convertDialogue();
