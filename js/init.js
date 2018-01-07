
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
	
	/* watch for local load */
	$('#local-load input[type="button"]').click( function(){
		smartManage.loadLocalReport();
	});
	
	
	/* watch for conformance level changes */
	$('input[name="wcag-level"]').click( function(){
		smartConformance.setWCAGConformanceLevel(this.value);
	});
	
	/* watch for optional criteria display changes */
	$('input.optional-criteria').click( function(){
		smartConformance.displaySuccessCriteria({wcag_level: this.id.replace('show-',''), display: (this.checked ? true : false)});
	});
	
	/* watch for clicks on SC status radio buttons */
	$('input.sc_status').click( function(){
		smartConformance.setSCStatus({name: this.name, value: this.value});
	});
	
	/* watch for clicks on SC filter */
	$('input.hide_sc').click( function(){
		smartConformance.filterSCByStatus(this);
	});
	
	/* watch for clicks on SC filter */
	$('input[name="status"]').click( function(){
		smartConformance.setGlobalSCStatus(this.value);
	});
	
	/* watch for clicks on SC filter */
	$('input.excl-test').click( function(){
		smartConformance.configureContentTypeTests({type: this.id, exclude: this.checked});
	});
	
	/* watch for clicks to show/hide sc bodies */
	$('input[name="sc-body"]').click( function(){
		smartConformance.showSCBody(this.value == 'true' ? true : false);
	});
	
	/* watch for clicks to show/hide help links */
	$('input[name="link-exp"]').click( function(){
		smartConformance.showSCHelpLinks(this.value == 'true' ? true : false);
	});
	
	/* watch for clicks to show/hide help links */
	$('input.show-note').click( function(){
		smartConformance.showSCNoteField(this);
	});

	
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
	
	/* watch for click to add custom accessibilityFeature */
	$('#add-a11y-feature').click( function(){
		smartDiscovery.addCustomFeature();
		return false;
	});
	
	/* watch for click to add custom accessibilityFeature */
	$('#add-sufficient').click( function(){
		smartDiscovery.addSufficient();
		return false;
	});
	
	/* watch for click on button to generate certification metadata */
	$('#generate-certification-metadata').click( function(){
		smartCertification.generateCertificationMeta();
	});
	
	/* watch for click on button to generate final report */
	$('#generate-report').click( function(){
		smartReport.generateConformanceReport(); 
	});
