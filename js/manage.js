
'use strict';

/* 
 * 
 * smartManage
 * 
 * Manages saving and loading in-progress evaluations
 * 
 * Public functions
 * 
 * - saveConformanceReport - writes a json object with the current evaluation data
 * 
 * - loadConformanceReport - reads in a saved object and populates the form
 * 
 * = loadLocalReport - reads the json from from the text box and calls loadConformanceReport to populate the form
 * 
 * - resetSMARTInterface - resets the smart tool to its initial unloaded state
 * 
 */

var smartManage = (function() {
	
	function saveConformanceReport() {
	
		var reportJSON = {};
		
		reportJSON.version = '1.0';
		reportJSON.category = 'savedReport';
		reportJSON.created = smartFormat.generateTimestamp('dash');
		
		/* store report configuration info */
		
		reportJSON.configuration = {};
			reportJSON.configuration.wcag = {};
				reportJSON.configuration.wcag.level = document.querySelector('input[name="wcag-level"]:checked').value;
				reportJSON.configuration.wcag.show_aa = (document.getElementById('show-aa').checked ? 'true' : 'false');
				reportJSON.configuration.wcag.show_aaa = (document.getElementById('show-aaa').checked ? 'true' : 'false');
		
			/* epub format */
			reportJSON.configuration.epub_format = document.querySelector('input[name="epub-format"]:checked').value;
			
			/* excluded content types array */
			var excluded_test_types = document.querySelectorAll('#exclusions input[type="checkbox"]:checked');
			reportJSON.configuration.exclusions = [];
			
			if (excluded_test_types) {
				for (var i = 0; i < excluded_test_types.length; i++) {
					reportJSON.configuration.exclusions.push(excluded_test_types[i].value);
				}
			}
			
			/* list of fallbacks */
			var fallbacks = document.querySelectorAll('#fallbacks > ul#fallback-types > li.listitem');
			
			reportJSON.configuration.fallbacks = [];
			if (fallbacks) {
				for (var i = 0; i < fallbacks.length; i++) {
					fallbacks[i].classList.forEach(function(value, key, listObj) {
						if (value != 'listitem') {
							reportJSON.configuration.fallbacks.push(value);
						}
					});
				}
			}
	
		/* store publication info */
		
		reportJSON.publicationInfo = {};
		reportJSON.publicationInfo.title = document.getElementById('title').value;
		reportJSON.publicationInfo.creator = document.getElementById('creator').value;
		reportJSON.publicationInfo.identifier = document.getElementById('identifier').value;
		reportJSON.publicationInfo.modified = document.getElementById('modified').value;
		reportJSON.publicationInfo.publisher = document.getElementById('publisher').value;
		reportJSON.publicationInfo.date = document.getElementById('date').value;
		reportJSON.publicationInfo.description = document.getElementById('description').value;
		reportJSON.publicationInfo.subject = document.getElementById('subject').value;
		reportJSON.publicationInfo['optional-meta'] = document.getElementById('optional-meta').value;
		
		/* store success criteria state */
		
		var success_criteria = document.querySelectorAll('.a, .aa, .aaa, .epub');
		
		reportJSON.conformance = [];
		
			for (var i = 0; i < success_criteria.length; i++) {
				
				var status = document.querySelector('input[name="'+success_criteria[i].id+'"]:checked').value;
				
				reportJSON.conformance[i] = {};
				reportJSON.conformance[i].id = success_criteria[i].id;
				reportJSON.conformance[i].status = status;
				
				if (status == 'fail') {
					reportJSON.conformance[i].error = document.getElementById(success_criteria[i].id+'-err').value;
				}
				
				if ((document.getElementsByName(success_criteria[i].id+'-note'))[0].checked) {
					reportJSON.conformance[i].note = document.getElementById(success_criteria[i].id+'-info').value;
				}
			}
		
		/* store discovery metadata */
		
		reportJSON.discovery = {};
		
			var a11yFields = new Array('accessibilityFeature','accessibilityHazard','accessMode','accessibilityAPI','accessibilityControl');
			
			a11yFields.forEach( function(id) {
				reportJSON.discovery[id] = saveDiscoveryMeta(id);
			});
			
			reportJSON.discovery.accessibilitySummary = document.getElementById('accessibilitySummary').value;
			reportJSON.discovery.accessModeSufficient = saveSufficientSets();
		
		/* store conformance metadata */
		
		reportJSON.certification = {};
		
			reportJSON.certification.result = document.getElementById('conformance-result').value;
			
			reportJSON.certification.certifiedBy = document.getElementById('certifiedBy').value;
			
			reportJSON.certification.certifierCredential = document.getElementById('certifierCredential').value;
			
			reportJSON.certification.certifierReport = document.getElementById('certifierReport').value;
		
		/* store extension data */
		
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				if (!reportJSON.hasOwnProperty(key)) {
					reportJSON[key ]= smart_extensions[key].saveData();
				}
				else {
					console.log('Extension ' + key + ' is matches an existing report property name. Data cannot be saved until a new name is selected.');
				}
			}
		}
		
		writeSavedJSON(JSON.stringify(reportJSON));
	}
	
	
	
	/* returns an array of checked discovery metadata values */
	function saveDiscoveryMeta(id) {
		var metaArray = [];
		var checkedItems = document.querySelectorAll('fieldset#' + id + ' input:checked');
		
		if (checkedItems.length > 0) {
			for (var i = 0; i < checkedItems.length; i++) {
				metaArray.push(checkedItems[i].value);
			}
		}
		
		return metaArray;
	}
	
	
	/* returns an object containing sets of sufficientAccessModes */
	function saveSufficientSets(id) {
		var setObject = {};
		
		var sufficientSets = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset');
		
		for (var i = 0; i < sufficientSets.length; i++) {
			var checkedAccessModes = sufficientSets[i].querySelectorAll('input:checked');
			
			if (checkedAccessModes.length > 0) {
				setObject['set'+i] = [];
					for (var j = 0; j < checkedAccessModes.length; j++) {
						setObject['set'+i].push(checkedAccessModes[j].value);
					}
			}
		}
		
		return setObject;
	}
	
	
	
	/* opens the saved evaluation window and writes the json data to it */
	function writeSavedJSON(reportJSON) {
		var evalWin = window.open('saved-evaluation.html','evalWin');
			evalWin.addEventListener('load', function() { evalWin.init(reportJSON); });
	}
	
	
	
	function loadLocalReport() {
		var report_textarea = document.getElementById('local-report-json');
		var report_text = report_textarea.value;
		var report_json;
		
		try {
			report_json = JSON.parse(report_text);
		}
		
		catch (e) {
			alert('Failed to load report.\n\n' + e); 
			return;
		}
		
		if (report_json.hasOwnProperty('category') && report_json.category == 'savedReport') {
			loadConformanceReport(report_json);
		}
		
		else {
			smartAce.storeReportJSON(report_json);
			smartAce.loadAceReport();
		}
		
		report_textarea.value = '';
	}
	
	
	
	function loadConformanceReport(reportJSON) {
	
		if (!reportJSON.hasOwnProperty('category') || reportJSON.category != 'savedReport') {
			alert('Invalid report - missing category identifier. Unable to load.');
			return;
		}
		
		if (!confirm('This action will delete the current evaluation and cannot be undone. Click Ok to continue.')) {
			return;
		}
		
		resetSMARTInterface(true);
		
		/* set the success criteria */
		
		for (var i = 0; i < reportJSON.conformance.length; i++) {
			document.querySelector('input[name="'+reportJSON.conformance[i].id+'"][value="'+ reportJSON.conformance[i].status + '"]').click();
			
			if (reportJSON.conformance[i].hasOwnProperty('error')) {
				document.getElementById(reportJSON.conformance[i].id+'-err').value = reportJSON.conformance[i].error;
			}
			
			if (reportJSON.conformance[i].hasOwnProperty('note')) {
				document.querySelector('input[name="'+reportJSON.conformance[i].id+'-note"]').click();
				document.getElementById(reportJSON.conformance[i].id+'-info').value = reportJSON.conformance[i].note;
			}
		}
		
		/* load the discovery metadata */
		
		var discovery_checkbox_fields = ['accessibilityFeature','accessibilityHazard','accessMode','accessibilityAPI','accessibilityControl'];
		
		discovery_checkbox_fields.forEach(function(id) {
			if (reportJSON.discovery.hasOwnProperty(id)) {
				setDiscoveryMetaCheckbox(id,reportJSON.discovery[id]);
			}
		});
		
		if (reportJSON.discovery.hasOwnProperty('accessibilitySummary')) {
			document.getElementById('accessibilitySummary').value = reportJSON.discovery.accessibilitySummary;
		}
		
		if (reportJSON.discovery.hasOwnProperty('accessModeSufficient')) {
			setSufficientModes(reportJSON.discovery.accessModeSufficient);
		}
		
		/* load certification and publication text fields */
		
		var text_fields = {
			publicationInfo: ['title', 'creator', 'identifier', 'modified', 'publisher', 'description', 'date', 'subject', 'optional-meta'],
			certification: ['certifiedBy','certifierReport']
		};
		
		for (var key in text_fields) {
			text_fields[key].forEach(function(id) {
				document.getElementById(id).value = reportJSON[key][id];
			})
		}
		
		if (reportJSON.certification.hasOwnProperty('result')) {
			document.getElementById('conformance-result').value = reportJSON.certification.result;
			document.getElementById('conformance-result-status').textContent = smartConformance.STATUS[reportJSON.certification.result]
		}
		
		/* load credential */
		
		if (reportJSON["certification"].hasOwnProperty("credential")) {
			document.getElementById('credentialName').value = reportJSON.certification.credential.name;
			document.getElementById('credentialLink').value = reportJSON.certification.credential.link;
		}
		
		/* load configuration info */
		
		document.querySelector('input[name="wcag-level"][value="' + reportJSON.configuration.wcag.level + '"]').click();
		
		if (reportJSON.configuration.wcag.show_aa && reportJSON.configuration.wcag.level != 'aa') {
			document.getElementById('show-aa').click();
		}
		
		if (reportJSON.configuration.wcag.show_aaa) {
			document.getElementById('show-aaa').click();
		}
		
		document.querySelector('input[name="epub-format"][value="' + reportJSON.configuration.epub_format + '"]').click();
		
		if (reportJSON.configuration.hasOwnProperty('exclusions') && reportJSON.configuration.exclusions) {
			reportJSON.configuration.exclusions.forEach(function(value) {
				document.querySelector('#exclusions input[value="' + value + '"]').click(); 
			});
		}
		
		if (reportJSON.configuration.hasOwnProperty('fallbacks') && reportJSON.configuration.fallbacks) {
			document.querySelector('#fallbacks').classList.add('visible');
			reportJSON.configuration.fallbacks.forEach(function(value) {
				var listitems = document.querySelectorAll('#fallbacks li.' + value);
				for (var i = 0; i < listitems.length; i++) {
					listitems[i].classList.add('visible');
				}
			});
		}
		
		/* load extension data */
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				smart_extensions[key].loadData(reportJSON);
			}
		}
		
		alert('Report successfully loaded!');
	}
	
	
	
	function setDiscoveryMetaCheckbox(id,obj) {
		for (var i = 0; i < obj.length; i++) {
			var checkbox = document.querySelector('#' + id + ' input[value="' + obj[i] + '"]');
			if (checkbox === null) {
				/* ignore except for accessibilityFeature, as indicates a user-defined feature */
				if (id == 'accessibilityFeature') {
					disc.addCustomFeature(obj[i]);
				}
			}
			else {
				checkbox.click();
			}
		}
	}
	
	
	
	function setSufficientModes(modeSets) {
		/* add any additional sets before loading */
		var setCount = Object.keys(modeSets).length;
		if (setCount > 2) {
			for (var j = 1; j <= setCount - 2; j++) {
				smartDiscovery.addNewSufficientSet();
			}
		}
		
		var sufficient_fields = document.querySelectorAll('#accessModeSufficient fieldset');
		
		var set_counter = 0;
		for (var set_id in modeSets) {
			modeSets[set_id].forEach(function(sufficient_mode) {
				sufficient_fields[set_counter].querySelector('input[value="' + sufficient_mode + '"]').click();
			});
			set_counter += 1;
		}
	}
	
	
	function resetSMARTInterface(quiet) {
		
		if (!quiet) {
			if (!confirm('WARNING: All currently entered data will be deleted. This operation cannot be undone.\n\nClick Ok to continue.')) {
				return;
			}
		}
		
		/* clear all forms */
		for (var x = 0; x < document.forms.length; x++) {
			document.forms[x].reset();
		}
		
		/* hide epub feature warnings (top of conformance page) */
		var epub_warning_elements = document.querySelectorAll('section.warning, li.manifest, li.bindings, li.epub-switch, li.epub-trigger');
		
		for (var i = 0; i < epub_warning_elements.length; i++) {
			epub_warning_elements[i].classList.remove('visible','hidden');
		}
		
		/* clear artefacts from the conformance checks */
		var success_criteria = document.querySelectorAll('section.a, section.aa, section.aaa, section.epub');
		
		for (var i = 0; i < success_criteria.length; i++) {
			// reset the status to remove background colours
			document.querySelector('input[name="' + success_criteria[i].id + '"][value="unverified"]').click();
			
			// click the notes twice because reset removes check without hiding note
			var note = document.querySelector('input[name="' + success_criteria[i].id + '-note"]');
				note.click();
				note.click();
		}
		
		/* clear artefacts from the discovery metadata */
		var discovery_fields = document.querySelectorAll('#discovery fieldset');
		
		for (var i = 0; i < discovery_fields.length; i++) {
			discovery_fields[i].classList.remove(smartFormat.BG.ERR, smartFormat.BG.WARN, smartFormat.BG.PASS, smartFormat.BG.NA);
			var custom_elements = discovery_fields[i].getElementsByClassName('custom');
			for (var j = 0; j < custom_elements.length; j++) {
				custom_elements[j].parentNode.removeChild(custom_elements[j]);
			}
		}
		
		/* clear warnings from the publication info */
		document.getElementById('title').classList.remove(smartFormat.BG.ERR);
		document.getElementById('modified').classList.remove(smartFormat.BG.ERR);
		
		/* clear extensions */
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				smart_extensions[key].clear();
			}
		}
		
		/* clear the error pane */
		
		smartError.clearAll();
		smartError.hideErrorPane();
		
		/* clear the import messages */
		
		var import_dlg = document.getElementById('import');
		
		while(import_dlg.firstChild) {
			import_dlg.removeChild(import_dlg.firstChild);
		}
	}
	
	
	
	return {
	
		saveConformanceReport: function() {
			saveConformanceReport();
		},
		
		loadLocalReport: function(){
			loadLocalReport();
		},
		
		loadConformanceReport: function(data){
			loadConformanceReport(data);
		},
		
		resetSMARTInterface: function(quiet) {
			resetSMARTInterface(quiet);
		}
	}

})();
