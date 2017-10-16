## Custom Extensions

This file explains how to add a custom extension to the conformance and reporting tool.

### 1. Set up extension directory

1. Create a copy of the /template directory in /extensions.
2. Rename the new folder to the username you use to log in.

### 2. Update extensions.php

1. Open the file: extensions/config.php file.
2. A your username the $ace_users variable
  - the name must match the directory you used in the first step
  - make sure to add a comma before to the end of the preceding entry
  - the value you assign is not important (typically use: 'username' => 1)
