
	'use strict';
	
	/*
	 *  REPORTING
	 */
	
	// add reporting fields to the conformance success criteria
	window.onload = function() {
		smartReport.addSuccessCriteriaReporting();
		loadReportJSON();
		
		// reset saveChanges after loading the form to prevent false positives when closing
		saveChanges = false;
	}
	
	function loadReportJSON() {
		
		var raw_report = document.getElementById('report_data').textContent;
		
		var data = JSON.parse(raw_report);
		
		if (data.hasOwnProperty('category') && data.category == 'savedEvaluation') {
			smartManage.loadConformanceEvaluation(data);
		}
		
		else {
			smartAce.storeReportJSON(data);
			smartAce.loadAceReport();
		}
	}

	
	
	
	/* 
	 * ERROR HANDLING
	 */
	 
	// initialize error reporting
	smartError.init();
	
	
	
	/* 
	 * POLYFILLS
	 */
	
	// initialize details polyfill
	$('details').details();
	
	
	
	/* 
	 * DIALOG CONFIGURATION
	 */

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
	
	var save_dialog = $("#save").dialog({
		autoOpen: false,
		height: 220,
		modal: true,
		buttons: {
			"Save": function() {
				smartManage.saveConformanceEvaluation($('input[name="location"]:checked').val())
			},
			"Close": function() {
				save_dialog.dialog( "close" );
			}
		}
	});
	
	discovery_dialog = $("#discovery-meta").dialog({
		autoOpen: false,
		height: 450,
		modal: true,
		buttons: {
			Close: function() {
				discovery_dialog.dialog( "close" );
			}
		}
	});
	
	onix_dialog = $("#distribution-meta").dialog({
		autoOpen: false,
		height: 450,
		modal: true,
		buttons: {
			Close: function() {
				onix_dialog.dialog( "close" );
			}
		}
	});
	
	evaluation_dialog = $("#evaluation-meta").dialog({
		autoOpen: false,
		height: 350,
		modal: true,
		buttons: {
			Close: function() {
				evaluation_dialog.dialog( "close" );
			}
		}
	});
	
	function adjustDialogWidth() {
		if (document.body.clientWidth < 550) {
			import_dialog.dialog("option", "width", 300);
			discovery_dialog.dialog("option", "width", 400);
			evaluation_dialog.dialog("option", "width", 400);
			onix_dialog.dialog("option", "width", 400);
			save_dialog.dialog("option", "width", 400);
		}
		else {
			import_dialog.dialog("option", "width", 550);
			discovery_dialog.dialog("option", "width", 750);
			evaluation_dialog.dialog("option", "width", 750);
			onix_dialog.dialog("option", "width", 750);
			save_dialog.dialog("option", "width", 400);
		}
	}
	
	// initial set
	adjustDialogWidth();
	
	// readjust dialog on browser resize
	$( window ).resize(function() {
		adjustDialogWidth();
	});
	
	
	
	/* 
	 * EVENT HANDLING
	 */
	
	
	/* INTERFACE */
	
	/* watch for save button click */
	$('#save-button').click( function(){
		save_dialog.dialog('open');
		return false;
	});
	
	/* watch for close button click */
	$('#close-button').click( function(){
		document.location.href = 'index.php';
	});
	
	/* watch for error pane close click */
	$('#error-pane-close').click( function(){
		smartError.hideErrorPane();
	});
	
	
	/* START TAB */
	
	/* watch for EPUB format changes */
	$('input[name="epub-format"]').click( function(){
		smartFormat.setEPUBVersion(this.value);
	});
	
	
	/* CONFORMANCE TAB */
	
	/* watch for wcag conformance level changes */
	$('input[name="wcag-level"]').click( function(){
		smartConformance.setWCAGConformanceLevel(this.value);
	});
	
	/* watch for optional criteria display changes */
	$('input.optional-criteria').click( function(){
		smartConformance.displaySuccessCriteria({wcag_level: this.id.replace('show-',''), display: (this.checked ? true : false)});
	});
	
	/* watch for filtering of success criteria by status */
	$('input.hide_sc').click( function(){
		smartConformance.filterSCByStatus(this);
	});
	
	/* watch for setting of global status to all success criteria */
	$('input[name="status"]').click( function(){
		smartConformance.setGlobalSCStatus(this.value);
	});
	
	/* watch for filtering of success criteria by content type */
	$('input.excl-test').click( function(){
		smartConformance.configureContentTypeTests({type: this.value, exclude: this.checked});
	});
	
	/* watch for clicks to show/hide success criteria descriptions */
	$('input[name="sc-body"]').click( function(){
		smartConformance.showSCBody(this.value == 'true' ? true : false);
	});
	
	/* watch for clicks to expand/collapse help links */
	$('input[name="link-exp"]').click( function(){
		smartConformance.showSCHelpLinks(this.value == 'true' ? true : false);
	});
	
	/* watch for changes to success criteria status radio buttons */
	$('input.sc_status').click( function(){
		smartConformance.setSCStatus({name: this.name, value: this.value});
	});
	
	/* watch for clicks to show/hide success criteria note fields */
	$('input.show-note').click( function(){
		smartConformance.showSCNoteField(this);
	});

	
	/* DISTRIBUTION TAB */
	
	/* watch for click to generate discovery metadata */
	$('#distribution_button').click( function(){
		smartDistribution.generateONIXMetadata();
	});
	
	
	/* REPORTING TAB */
	
	/* watch for changes to note output */
	$('input[name="show-notes"]').click( function(){
		smartReport.setNoteOutput(this.value);
	});
	
	/* watch for click on button to generate final report */
	$('#preview-report').click( function(){
		smartReport.generateConformanceReport('preview'); 
	});

	/* watch for click on button to generate final report */
	$('#generate-report').click( function(){
		smartReport.generateConformanceReport('report');
	});
	
	
	/* Save changes prompt */
	
	$(":input").change(function() {
		saveChanges = true;
	});
	
	$(window).on("beforeunload",function(){
		if (firstSave) {
			return "This evaluation has not been saved. It cannot be resumed if you leave without saving."
		}
		if (saveChanges) {
			return "You appear to have unsaved changes.";
		}
	});
