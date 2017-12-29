
	'use strict';
	
	// initialize details polyfill
	$('details').details();
	
	// set error elements
	smartError.init();
	
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
	
	function adjustDialogWidth() {
		if (document.body.clientWidth < 550) {
			import_dialog.dialog("option", "width", 300);
		}
		else {
			import_dialog.dialog("option", "width", 550);
		}
	}
	
	// initial set
	adjustDialogWidth();
	
	// readjust dialog on browser resize
	$( window ).resize(function() {
		adjustDialogWidth();
	});
	
	
	/* generate the reporting fields when page loads */
	window.onload = smartReport.addSuccessCriteriaReporting();
	
	/* watch for clicks on SC status radio buttons */
	$('input.sc_status').click( function(){
		smartConformance.setStatus(this);
	});


