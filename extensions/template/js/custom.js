
var user_ext = new Extension();

function Extension() {
	/* 
	 * for logos, property name is username
	 * array values: [0] credential image url, [1] alt text, [2] link to credential info
	 */ 
	
	this.LOGOS = {
		'foobar': ['https://example.com/image.jpg', 'Certified by FooBar', 'https://example.com/moreinfo']
	}
	// result -> <a href="https://example.com/moreinfo"><img src="https://example.com/image.jpg" alt="Certified by FooBar"/></a>
}


Extension.prototype.clear = function() {
	// called when the form is being reset - add code to clear extension tabs, if necessary
	 
}


Extension.prototype.validate = function() {
	
	var valid = true;
	
	// add any validation calls before generating HTML here
	
	return valid;
}


Extension.prototype.addReport = function() {
	
	var reportHTML = '';
	
	// add code that generates additional HTML to include in the output report
	
	return reportHTML;
}


Extension.prototype.saveData = function() {

	var JSONFrag = '';
	
	/* 
	 * generate an JSON fragment that includes any data you need to save
	 * fragment is appended to the root of the saved data json object
	*/
	
	return JSONFrag;
}


Extension.prototype.loadData = function(json) {
	
	/*  use this function to reload your saved data
	 *  json variable contains all saved data, not just the fragment above
	 */ 

}
