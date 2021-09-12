const fs = require("fs");
const writeToFile = require("./writeToFile");
const inputPath = "../input/crook.txt";
let crookedSteps = [];


function convertCrooked(settings = {
  letterInterval: 1,    // how many letters per "section" the line is cut up into
  step: 0.5,            // pixel step of offsets
  possibleSteps: 3,     // how many steps, e.g. "0" -> "0.5" -> "1" is 2 steps
  trimSpace: true,      // remove space from sections
  genCss: true          // output a CSS file?
  })
{
  // generate crooked steps
  for (let s = -1 * settings.possibleSteps; s <= settings.possibleSteps; s++) {
    crookedSteps.push(s * settings.step);
  }

  // generate css file is needed
  if (settings.genCss) {
      let crookedCSS = ".ck { display: inline-block; }\n";
      for (let x = 0; x < crookedSteps.length; x++) {
        for (let y = 0; y < crookedSteps.length; y++) {
          crookedCSS += `.ck-${x}-${y} { transform: translate(${crookedSteps[x]}px, ${crookedSteps[y]}px); }\n`;
        }
      }
      writeToFile.gen(crookedCSS, "crookedCSS", "css");
  }

  // process text
  let inputText = fs.readFileSync(inputPath).toString().split("\r\n");
  let crook = "";
  for (let l = 0; l < inputText.length; l++) {
    crook += crookedText(inputText[l], settings);
    crook += "\n";
  }

  // output to a file
  writeToFile.gen(crook, "crooked");
}


function crookedText(input, settings) {
  let lI = settings.letterInterval;
  let outputText = "";

  // divide into sections to apply crookedness to
  for (let lt = 0; lt < Math.ceil(input.length / lI); lt++) {
    let section = input.slice(lt * lI, lt * lI + lI);
    let beginSpace = "",
        endSpace = "";

    // do we want to cut whitespace out of the text sections?
    // the answer is yes by the way
    if (settings.trimSpace) {
      beginSpace += (" ").repeat(section.match(/^\s*/)[0].length);
      endSpace += (" ").repeat(section.match(/\s*$/)[0].length);
      // console.log(`'${section}', ${beginSpace.length}, ${endSpace.length}`);
      section = section.trimEnd().trimStart();
      // console.log(section);
    }

    // determine which "crooked text" class each section gets
    let rand_x = Math.floor(Math.random() * crookedSteps.length);
    let rand_y = Math.floor(Math.random() * crookedSteps.length);
    outputText += `${beginSpace}<span class="ck ck-${rand_x}-${rand_y}">${section}</span>${endSpace}`;
  }
  return outputText;
}


convertCrooked();
