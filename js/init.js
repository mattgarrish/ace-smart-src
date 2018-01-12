
	'use strict';
	
	/*
	 *  REPORTING
	 */
	
	// add reporting fields to the conformance success criteria
	window.onload = smartReport.addSuccessCriteriaReporting();
	
	
	
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
	
	
	
	/* 
	 * EVENT HANDLING
	 */
	
	
	/* INTERFACE */
	
	/* watch for save button click */
	$('#save-button').click( function(){
		smartManage.saveConformanceReport();
		return false;
	});
	
	/* watch for clear button click */
	$('#clear-button').click( function(){
		smartManage.resetSMARTInterface();
		return false; 
	});
	
	/* watch for error pane close click */
	$('#error-pane-close').click( function(){
		smartError.hideErrorPane();
	});
	
	
	/* START TAB */
	
	/* watch for local load of a report */
	$('#local-load input[type="button"]').click( function(){
		smartManage.loadLocalReport();
	});
	
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
		smartConformance.configureContentTypeTests({type: this.id, exclude: this.checked});
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

	
	/* DISCOVERY TAB */
	
	/* watch for click to add custom accessibilityFeature */
	$('#add-a11y-feature').click( function(){
		smartDiscovery.addCustomFeature();
		return false;
	});
	
	/* watch for click to add additional accessModeSufficient sets */
	$('#add-sufficient').click( function(){
		smartDiscovery.addNewSufficientSet();
		return false;
	});
	
	/* watch for click to generate discovery metadata */
	$('#discovery_button').click( function(){
		smartDiscovery.generateDiscoveryMetadata();
	});
	
	
	/* CERTIFICATION TAB */
	
	/* watch for click on button to generate certification metadata */
	$('#generate-certification-metadata').click( function(){
		smartCertification.generateCertificationMetadata();
	});
	
	
	/* REPORTING TAB */
	
	/* watch for changes to note output */
	$('input[name="show-notes"]').click( function(){
		smartReport.setNoteOutput(this.value);
	});
	
	/* watch for changes to output location */
	$('input[name="report-location"]').click( function(){
		smartReport.setReportOutputLocation(this.value);
	});
	
	/* watch for click on button to generate final report */
	$('#generate-report').click( function(){
		smartReport.generateConformanceReport(); 
	});


