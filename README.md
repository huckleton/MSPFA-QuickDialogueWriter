# MSPFA-QuickDialogueWriter
convert dialogue into formatted bbcode + html for use on mspfa the website

## how to use this

### add characters
edit names.json with new characters under a key. the key is what you use for their "name" in the dialogue

all of the possible tags are included in the "_EXAMPLE" character.. study them

### write dialogue
names are defined before a colon (:). so if you type `_EXAMPLE: fart poo poo` then "_EXAMPLE" will be the name of the character.
the character's name should ideally match a key in the characters `json` file, not the actual **display name** of the character. if it doesn't, no biggie - it just won't add fancy bbcode to it

### generate dialogue
1. have nodejs installed
2. download the contents of this repo into its own folder
4. type "CMD" into the explorer address bar with the folder containing this code in
5. type "node write" into node
6. output file is created in the same folder
