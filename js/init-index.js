
	var import_dialog = $("#import").dialog({
		autoOpen: false,
		height: 145,
		width: 500,
		modal: true,
		buttons: {
			'Open': function() {
				$('#file').prop("files", document.getElementById('local-report').files);
				document.getElementById('nextStep').submit();
			},
			'Close': function() {
				import_dialog.dialog( "close" );
			}
		}
	});
	
	var nextStep = document.getElementById('nextStep');
	
	$('input[type="image"]').click( function(){
		
		var operation = this.id.substring(0,3);
		var report_id = this.id.replace(/^[_a-z]+/i,'');
		
		if (operation == 'del') {
			if (confirm('You are about to delete the stored report data from the server. This action cannot be undone.\n\nClick Ok to continue.')) {
				document.getElementById('id').value = report_id;
				document.getElementById('action').value = 'delete';
				nextStep.action = 'index.php';
				nextStep.submit();
			}
		}
		
		else if (operation == 'rel') {
			document.getElementById('id').value = report_id;
			document.getElementById('action').value = 'reload';
			import_dialog.dialog('open');
		}
		
		else if (operation == 'res') {
			document.getElementById('id').value = report_id;
			document.getElementById('action').value = 'resume';
			nextStep.action = 'smart.php';
			nextStep.submit();
		}
	});
	
	var dt = new DT();
	
	$(document).ready(function(){
		setView('');
	});
	
	function setView(tblType) {
		dt.setTableType(tblType);
		var options = {
			"searchable": true,
			"setDefaultSort": true,
			"changeDefaultSort": false,
			"tableType": tblType
		}
		dt.initialize(options);
	}
