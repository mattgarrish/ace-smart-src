## Custom Extensions

This file explains how to add a custom extension to the conformance and reporting tool.

### 1. Set up Extension Directory

1. Copy the ```/template``` directory in ```/extensions```.
2. Name the new folder using the module name (```/extensions/{module}/```).

### 2. Update ```extensions.php```

1. Open the file: ```extensions/config.php``` file.
2. Add the module name to the $user_modules variable
  - the name must match the directory name used in the first step
  - make sure to add a comma before to the end of the preceding entry
  - set the value to an empty array (typically use: 'module' => [])

Example entry for the module foobar:
```
	$user_modules = [
		'foobar' => [ ]
	];
```

### 3. Create New Tab

1. Open the file ```/extensions/{module}/tab/custom.php```. This file can be renamed.
2. Add the module HTML markup to this file:
  * the contents of a tab must be an HTML fragment with a ```section``` element as its root;
  * the ```section``` element must have the ```class``` ```js-tabcontent```;
  * the ```section``` element must have an ```id``` that matches the name of the file. (not including the ```.php``` file extension).
  * script can be embedded in the file, but it is recommended to create new JavaScript files in the ```/extensions/{module}/js``` directory and link across.
3. Add the tab to the $user_modules variable created in step 2
  * add a new variable 'tab' with an array value
  * include the new tab using the form: 'id' => 'title', where the ID must match the ```id``` of the ```section``` element and the title is the title as it will appear in the list of tabs

Example tab entry:
```
	$user_modules = [
		'foobar' => [
			'tab' => [
				'test' => 'Test tab'
			]
		]
	];
```

### 4. Extend Core Scripts

1. Open the ```/extensions/{module}/js/custom.js``` file. Do not rename the file.
2. Rename the ```$extension``` variable declaration at the top of the file (```$extension['module']```) so that "```module```" is the module name from step 2.
3. Add any necessary coding to the extension functions:
  * ```clear``` - This function is called whenever the tool is reset (e.g., when the Clear button is clicked, or a new report loaded). Forms are automatically reset, but if any additional code is necessary to reset your module add it here.
  * ```validate``` - This function is called when a final report is generated. If you already have a function to validate your module, simply call it from here. Ensure that there are no alerts, or that alerts are suppressed. Errors must be written to the error panel using ```err.write()```. Return true if validation passes or false if not.
  * ```addReport``` - This function is called to obtain the HTML to add to the final report. Return an HTML fragement, typically a ```details``` element, as this markup is added after the WCAG report sections.
  * ```saveData``` - This function is called when a user attempts to save their work. Return a JSON fragment that can be included in the saved data. The only requirement is that the root property should have a unique name. Using the module name is advised. 
  * ```loadData``` - This function is called when a user attempts to reload their saved data. Module data is available in ```json['id']``` where ```id``` is the property name from the save step.

### 5. Add Custom CSS

1. Add any custom CSS necessary to style the module to the ```extensions/{module}/css/custom.css``` file. Do not rename the file.
2. Ensure that all CSS selectors are scoped to the ```section``` element containing your module (i.e., start all selectors with ```section#id```). Selectors that may interfere with the general appearance of the site will cause your module to be rejected until fixed.
