
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
 */

var smartManage = (function() {
	
	var _saved = false;
	
	function saveConformanceReport(location) {
	
		var reportJSON = {};
		
		_saved = false;
		
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
			
			reportJSON.discovery.accessibilitySummary = document.getElementById('accessibilitySummary').value.trim();
			reportJSON.discovery.accessModeSufficient = saveSufficientSets();
		
		/* store onix metadata */
		
		reportJSON.distribution = {};
		
			reportJSON.distribution.onix = {};
			reportJSON.distribution.onix['00'] = document.getElementById('onix00').value.trim();
			for (var o = 10; o < 25; o++) {
				var onix_id = o < 10 ? '0' + String(o) : o;
				var onix_chkbox = document.getElementById('onix' + onix_id);
				if (onix_chkbox) {
					reportJSON.distribution.onix[onix_id] = onix_chkbox.checked;
				}
			}
			for (var p = 94; p < 100; p++) {
				reportJSON.distribution.onix[p] = document.getElementById('onix'+p).value.trim();
			}
		
		/* store conformance metadata */
		
		reportJSON.evaluation = {};
		
			reportJSON.evaluation.result = document.getElementById('conformance-result').value;
			
			reportJSON.evaluation.certifiedBy = document.getElementById('certifiedBy').value;
			
			reportJSON.evaluation.certifierReport = document.getElementById('certifierReport').value;
		
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
		
		(location == 'local') ? 
			writeSavedJSON(JSON.stringify(reportJSON)) : 
			storeSavedJSON(JSON.stringify(reportJSON));
		
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
	
	
	
	/* creates json download of saved report */
	function writeSavedJSON(reportJSON) {
		var report_form = document.createElement('form');
			report_form.target = '_blank';    
			report_form.method = 'POST';
			report_form.action = 'save.php';
		
		var report_data = document.createElement('input');
			report_data.type = 'hidden';
			report_data.name = 'report';
			report_data.value = reportJSON;
		report_form.appendChild(report_data);
		
		var report_title = document.createElement('input');
			report_title.type = 'hidden';
			report_title.name = 'title';
			report_title.value = document.getElementById('title').value;
		report_form.appendChild(report_title);
		
		var report_location = document.createElement('input');
			report_location.type = 'hidden';
			report_location.name = 'location';
			report_location.value = 'file';
		report_form.appendChild(report_location);
		
		document.body.appendChild(report_form);
		report_form.submit();
		report_form.parentNode.removeChild(report_form);

    	saveChanges = false;
		save_dialog.dialog('close');
	
	}
	
	
	/* ajax call to store data on the server */
	function storeSavedJSON(reportJSON) {
		$.ajax(
		{
			url: 			'save.php',
			type:			'POST',
			data: 			jQuery.param({ 
								'u': ACE_USER,
								'c': ACE_USER_CO,
								't': document.getElementById('title').value,
								'id': ACE_ID,
								'report': reportJSON,
								'location': 'db'
							}),
			contentType:    'application/x-www-form-urlencoded; charset=UTF-8',
			cache:			false,
			processData:	false,
			complete: function()
			{
				// no actions defined
			},
			success: function( data )
			{
				try {
					var response = JSON.parse(data);
					if (response.error) {
						alert( 'Sorry, an error occurred saving the report. Please try again.' );
					}
					else {
    					saveChanges = false;
						save_dialog.dialog('close');
						alert(response.status);
					}
				}
				
				catch (error) {
					alert( 'Sorry, the server returned an invalid response. Please try again.');
				}
			},
			error: function (xhr, ajaxOptions, thrownError) {
				alert( 'Sorry, an error occurred contacting the server. Please try again.' );
			}
		});
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
			// TODO: throw error if an ace report
		}
		
		report_textarea.value = '';
	}
	
	
	
	function loadConformanceReport(reportJSON) {
	
		if (!reportJSON.hasOwnProperty('category') || reportJSON.category != 'savedReport') {
			alert('Invalid report - missing category identifier. Unable to load.');
			return;
		}
		
		/* set the success criteria */
		
		if (reportJSON.hasOwnProperty('conformance')) {
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
		}
		
		/* load the discovery metadata */
		
		if (reportJSON.hasOwnProperty('discovery')) {
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
		}
		
		/* load onix metadata */
		
		if (reportJSON.hasOwnProperty('distribution')) {
			if (reportJSON.distribution.hasOwnProperty('onix')) {
				for (var onix_id in reportJSON.distribution.onix) {
					if (onix_id == 0 || onix_id > 90) {
						document.getElementById('onix' + onix_id).value = reportJSON.distribution.onix[onix_id];
					}
					else {
						if (reportJSON.distribution.onix[onix_id]) {
							document.getElementById('onix' + onix_id).click();
						}
					}
				}
			}
		}
		
		/* load evaluation and publication text fields */
		
		var text_fields = {
			publicationInfo: ['title', 'creator', 'identifier', 'modified', 'publisher', 'description', 'date', 'subject', 'optional-meta'],
			evaluation: ['certifiedBy','certifierReport']
		};
		
		for (var key in text_fields) {
			if (reportJSON.hasOwnProperty(key)) {
				text_fields[key].forEach(function(id) {
					document.getElementById(id).value = reportJSON[key][id];
				});
			}
		}
		
		if (reportJSON.hasOwnProperty('evaluation') && reportJSON.evaluation.hasOwnProperty('result')) {
			document.getElementById('conformance-result').value = reportJSON.evaluation.result;
			document.getElementById('conformance-result-status').textContent = smartConformance.STATUS[reportJSON.evaluation.result]
		}
		
		/* load configuration info */
		
		if (reportJSON.hasOwnProperty('configuration')) {
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
		}
		
		/* load extension data */
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				smart_extensions[key].loadData(reportJSON);
			}
		}
	}
	
	
	
	function setDiscoveryMetaCheckbox(id,obj) {
		for (var i = 0; i < obj.length; i++) {
			var checkbox = document.querySelector('#' + id + ' input[value="' + obj[i] + '"]');
			if (checkbox === null) {
				/* ignore except for accessibilityFeature, as indicates a user-defined feature */
				if (id == 'accessibilityFeature') {
					smartDiscovery.addCustomFeature(obj[i]);
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
	
	
	return {
	
		saveConformanceReport: function(location) {
			saveConformanceReport(location);
		},
		
		loadLocalReport: function(){
			loadLocalReport();
		},
		
		loadConformanceReport: function(data){
			loadConformanceReport(data);
		}
	}

})();
