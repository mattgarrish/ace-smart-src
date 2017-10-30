## Custom Extensions

This file explains how to add a custom extension to the conformance and reporting tool.

### 1. Set up extension directory

1. Create a copy of the ```/template``` directory in ```/extensions```.
2. Rename the new folder to the username you use to log in (```/extensions/{username}/```).

### 2. Update extensions.php

1. Open the file: ```extensions/config.php``` file.
2. Add your username to the $ace_users variable (NOTE: may change from user name to another db identifier)
  - the name must match the directory you used in the first step
  - make sure to add a comma before to the end of the preceding entry
  - the value you assign is not important (typically use: 'username' => 1)

### 3. Create new tab

1. Create the new tab in the ```/extensions/{username}/tab``` directory
2. The contents of the tab must be an HTML fragment with a ```section``` element as its root
3. The ```section``` element must have the ```class``` ```js-tabcontent```
4. The ```section``` element must have an ```id```
5. Include whatever markup and script is necessary to run the tab

### 4. Extend core scripts

1. Open the ```/extensions/username/js/custom.js``` file.