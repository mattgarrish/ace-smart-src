
// change 'module' to module name in config.php
smart_extensions['module'] = (function() {
	/* 
	 * if setting a logo, array values are: [0] credential image url, [1] alt text, [2] link to credential info
	 * 
	 * example: var _LOGO = ['https://example.com/image.jpg', 'Certified by FooBar', 'https://example.com/moreinfo']
	 * 
	 * result: <a href="https://example.com/moreinfo"><img src="https://example.com/image.jpg" alt="Certified by FooBar"/></a>
	 */ 
	
	var _LOGO = [];
	
	return {
	
		LOGO: _LOGO,
		
		clear: function() {
			// called when the form is being reset - add code to clear extension tabs, if necessary
			 
		},
		
		validate: function() {
			
			var valid = true;
			
			// add any validation calls before generating HTML here
			
			return valid;
		},
		
		generateReport: function() {
			
			var reportHTML = document.createElement('section');
				reportHTML.setAttribute('class','js-tabcontent');
				reportHTML.setAttribute('id','module'); // change module to name of the module in config.php
			
			var tab_hd = document.createElement('h3');
				tab_hd.appendChild(document.createTextNode('Tab title')); // replace with actual title
			
			reportHTML.appendChild(tab_hd);
			
			// add code that generates additional HTML to include in the output report
			
			return reportHTML;
		},
		
		saveData: function() {
		
			var JSON = {};
			
			/* 
			 * generate an JSON fragment that includes any data you need to save
			 * fragment is appended to the root of the saved data json object
			*/
			
			return JSON.toString();
		},
		
		
		loadData: function(JSON) {
			
			/*  use this function to reload data created in saveData function */ 
		
		}
	}
	
})();
