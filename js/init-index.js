
	var import_dialog = $("#import").dialog({
		autoOpen: false,
		height: 145,
		width: 500,
		modal: true,
		buttons: {
			'Open': function() {
				$('#file').prop("files", document.getElementById('local-eval').files);
				document.getElementById('nextStep').submit();
			},
			'Close': function() {
				import_dialog.dialog( "close" );
			}
		}
	});
	
	var error_dialog = $("#error").dialog({
		autoOpen: false,
		height: 200,
		width: 500,
		modal: true,
		buttons: {
			'Close': function() {
				error_dialog.dialog( "close" );
			}
		}
	});
	
	var nextStep = document.getElementById('nextStep');
	
	$('input[type="image"]').click( function(){
		
		var operation = this.id.substring(0,3);
		var eval_id = this.id.replace(/^[_a-z]+/i,'');
		
		if (operation == 'del') {
			if (confirm('You are about to delete the stored evaluation data from the server. This action cannot be undone.\n\nClick Ok to continue.')) {
				document.getElementById('id').value = eval_id;
				document.getElementById('action').value = 'delete';
				nextStep.action = 'index.php';
				nextStep.submit();
			}
		}
		
		else if (operation == 'rel') {
			document.getElementById('id').value = eval_id;
			document.getElementById('action').value = 'reload';
			import_dialog.dialog('open');
		}
		
		else if (operation == 'res') {
			document.getElementById('id').value = eval_id;
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
	
	
	// error reporting
	
	var error_code = getParameterByName('err');
	
	if (error_code) {
		var smart_lang = 'en';
		var error_msg = smart_errors[smart_lang][error_code] ? smart_errors[smart_lang][error_code] : smart_messages[smart_lang]['unknown'];
		document.getElementById('error-msg').textContent = error_msg;
		error_dialog.dialog('open');
	}

	
	function getParameterByName(name, url) {
		if (!url) url = window.location.href;
		name = name.replace(/[\[\]]/g, '\\$&');
		var regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
		results = regex.exec(url);
		if (!results) return null;
		if (!results[2]) return '';
		return decodeURIComponent(results[2].replace(/\+/g, ' '));
	}