	
	var qs = new URLSearchParams(window.location.search);
	
	// initialize details polyfill
	$('details').details();
	
	// set error elements
	error.init();
	
	// initialize dialogs
	var import_dialog = $("#import").dialog({
		autoOpen: false,
		height: 350,
		modal: true,
		buttons: {
			Close: function() {
				import_dialog.dialog( "close" );
			}
		}
	});
	
	function setDialogWidth() {
		if (document.body.clientWidth < 550) {
			import_dialog.dialog("option", "width", 300);
		}
		else {
			import_dialog.dialog("option", "width", 550);
		}
	}
	
	// fix dialog size to match browser size
	$( window ).resize(function() {
		setDialogWidth();
	});
	
	// initial set
	setDialogWidth();
	

