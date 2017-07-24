	
	// initialize details polyfill
	$('details').details();
	
	// initialize dialogs
	var config_dialog = $("#config").dialog({
		autoOpen: false,
		height: 450,
		modal: true,
		buttons: {
			Close: function() {
			  config_dialog.dialog( "close" );
			}
		}
	  });
	
	var manage_dialog = $("#manage").dialog({
		autoOpen: false,
		height: 450,
		modal: true,
		buttons: {
			Close: function() {
			  manage_dialog.dialog( "close" );
			}
		}
	  });
	
	function setDialogWidth() {
		if (document.body.clientWidth < 550) {
			config_dialog.dialog("option", "width", 300);
			manage_dialog.dialog("option", "width", 300);
		}
		
		else {
			config_dialog.dialog("option", "width", 550);
			manage_dialog.dialog("option", "width", 550);
		}
	}
	
	// fix dialog size to match browser size
	$( window ).resize(function() {
		setDialogWidth();
	});
	
	// initial set
	setDialogWidth();
	
	// hide note
	conf.checkHideFormNote();
	
