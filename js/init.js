	
	var qs = new URLSearchParams(window.location.search);
	
	// initialize details polyfill
	$('details').details();
	
	// initialize dialogs
	var config_dialog = $("#config").dialog({
		autoOpen: false,
		height: qs.has('admin') ? 410 : 350,
		modal: true,
		buttons: {
			Close: function() {
			  config_dialog.dialog( "close" );
			}
		}
	  });
	
	var save_dialog = $("#save-report").dialog({
		autoOpen: false,
		height: 300,
		modal: true,
		buttons: {
			Close: function() {
			  save_dialog.dialog( "close" );
			}
		}
	  });
	
	var load_dialog = $("#load-report").dialog({
		autoOpen: false,
		height: 325,
		modal: true,
		buttons: {
			Close: function() {
			  load_dialog.dialog( "close" );
			}
		}
	  });
	
	function setDialogWidth() {
		if (document.body.clientWidth < 550) {
			config_dialog.dialog("option", "width", 300);
			save_dialog.dialog("option", "width", 300);
			load_dialog.dialog("option", "width", 300);
		}
		
		else {
			config_dialog.dialog("option", "width", 550);
			save_dialog.dialog("option", "width", 550);
			load_dialog.dialog("option", "width", 550);
		}
	}
	
	// fix dialog size to match browser size
	$( window ).resize(function() {
		setDialogWidth();
	});
	
	// initial set
	setDialogWidth();
	
	// hide admin test controls
	if (!qs.has('admin')) {
		document.getElementById('set-all').style.display = 'none';
	}
