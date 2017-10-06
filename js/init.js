	
	var qs = new URLSearchParams(window.location.search);
	
	// initialize details polyfill
	$('details').details();
	
	// reenable generation after includes
	conf_meta.setDaisyCredential();
	
	// set error elements
	error.init();
