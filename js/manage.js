
'use strict';

/* 
 * 
 * smartManage
 * 
 * Manages saving and loading in-progress evaluations
 * 
 * Public functions
 * 
 * - saveConformanceEvaluation - writes a json object with the current evaluation data
 * 
 * - loadConformanceEvaluation - reads in a saved object and populates the form
 * 
 */

var smartManage = (function() {
	
	var _saved = false;
	
	function saveConformanceEvaluation(location) {
	
		var evaluationJSON = {};
		
		_saved = false;
		
		evaluationJSON.version = '1.0';
		evaluationJSON.category = 'savedEvaluation';
		evaluationJSON.created = smartFormat.generateTimestamp('dash');
		
		/* store report configuration info */
		
		evaluationJSON.configuration = {};
			evaluationJSON.configuration.wcag = {};
				evaluationJSON.configuration.wcag.level = document.querySelector('input[name="wcag-level"]:checked').value;
				evaluationJSON.configuration.wcag.show_aa = (document.getElementById('show-aa').checked ? 'true' : 'false');
				evaluationJSON.configuration.wcag.show_aaa = (document.getElementById('show-aaa').checked ? 'true' : 'false');
		
			/* epub format */
			evaluationJSON.configuration.epub_format = document.querySelector('input[name="epub-format"]:checked').value;
			
			/* excluded content types array */
			var excluded_test_types = document.querySelectorAll('#exclusions input[type="checkbox"]:checked');
			evaluationJSON.configuration.exclusions = [];
			
			if (excluded_test_types) {
				for (var i = 0; i < excluded_test_types.length; i++) {
					evaluationJSON.configuration.exclusions.push(excluded_test_types[i].value);
				}
			}
			
			/* list of fallbacks */
			var fallbacks = document.querySelectorAll('#fallbacks > ul#fallback-types > li.listitem');
			
			evaluationJSON.configuration.fallbacks = [];
			if (fallbacks) {
				for (var i = 0; i < fallbacks.length; i++) {
					fallbacks[i].classList.forEach(function(value, key, listObj) {
						if (value != 'listitem') {
							evaluationJSON.configuration.fallbacks.push(value);
						}
					});
				}
			}
	
		/* store publication info */
		
		evaluationJSON.publicationInfo = {};
		evaluationJSON.publicationInfo.title = document.getElementById('title').value;
		evaluationJSON.publicationInfo.creator = document.getElementById('creator').value;
		evaluationJSON.publicationInfo.identifier = document.getElementById('identifier').value;
		evaluationJSON.publicationInfo.modified = document.getElementById('modified').value;
		evaluationJSON.publicationInfo.publisher = document.getElementById('publisher').value;
		evaluationJSON.publicationInfo.date = document.getElementById('date').value;
		evaluationJSON.publicationInfo.description = document.getElementById('description').value;
		evaluationJSON.publicationInfo.subject = document.getElementById('subject').value;
		evaluationJSON.publicationInfo['optional-meta'] = document.getElementById('optional-meta').value;
		
		/* store success criteria state */
		
		var success_criteria = document.querySelectorAll('.a, .aa, .aaa, .epub');
		
		evaluationJSON.conformance = [];
		
			for (var i = 0; i < success_criteria.length; i++) {
				
				var status = document.querySelector('input[name="'+success_criteria[i].id+'"]:checked').value;
				
				evaluationJSON.conformance[i] = {};
				evaluationJSON.conformance[i].id = success_criteria[i].id;
				evaluationJSON.conformance[i].status = status;
				
				if (status == 'fail') {
					evaluationJSON.conformance[i].error = document.getElementById(success_criteria[i].id+'-err').value;
				}
				
				if ((document.getElementsByName(success_criteria[i].id+'-note'))[0].checked) {
					evaluationJSON.conformance[i].note = document.getElementById(success_criteria[i].id+'-info').value;
				}
			}
		
		/* store discovery metadata */
		
		evaluationJSON.discovery = {};
		
			var a11yFields = new Array('accessibilityFeature','accessibilityHazard','accessMode','accessibilityAPI','accessibilityControl');
			
			a11yFields.forEach( function(id) {
				evaluationJSON.discovery[id] = saveDiscoveryMeta(id);
			});
			
			evaluationJSON.discovery.accessibilitySummary = document.getElementById('accessibilitySummary').value.trim();
			evaluationJSON.discovery.accessModeSufficient = saveSufficientSets();
		
		/* store onix metadata */
		
		evaluationJSON.distribution = {};
		
			evaluationJSON.distribution.onix = {};
			evaluationJSON.distribution.onix['00'] = document.getElementById('onix00').value.trim();
			for (var o = 10; o < 25; o++) {
				var onix_id = o < 10 ? '0' + String(o) : o;
				var onix_chkbox = document.getElementById('onix' + onix_id);
				if (onix_chkbox) {
					evaluationJSON.distribution.onix[onix_id] = onix_chkbox.checked;
				}
			}
			for (var p = 94; p < 100; p++) {
				evaluationJSON.distribution.onix[p] = document.getElementById('onix'+p).value.trim();
			}
		
		/* store conformance metadata */
		
		evaluationJSON.evaluation = {};
		
			evaluationJSON.evaluation.result = document.getElementById('conformance-result').value;
			
			evaluationJSON.evaluation.certifiedBy = document.getElementById('certifiedBy').value;
			
			evaluationJSON.evaluation.certifierReport = document.getElementById('certifierReport').value;
		
		/* store extension data */
		
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				if (!evaluationJSON.hasOwnProperty(key)) {
					evaluationJSON[key ]= smart_extensions[key].saveData();
				}
				else {
					console.log('Extension ' + key + ' is matches an existing report property name. Data cannot be saved until a new name is selected.');
				}
			}
		}
		
		(location == 'local') ? 
			writeSavedJSON(JSON.stringify(evaluationJSON)) : 
			storeSavedJSON(JSON.stringify(evaluationJSON));
		
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
	function writeSavedJSON(evaluationJSON) {
		var report_form = document.createElement('form');
			report_form.target = '_blank';    
			report_form.method = 'POST';
			report_form.action = 'save.php';
		
		var report_user = document.createElement('input');
			report_user.type = 'hidden';
			report_user.name = 'u';
			report_user.value = ACE_USER;
		report_form.appendChild(report_user);
		
		var report_company = document.createElement('input');
			report_company.type = 'hidden';
			report_company.name = 'c';
			report_company.value = ACE_USER_CO;
		report_form.appendChild(report_company);
		
		var report_title = document.createElement('input');
			report_title.type = 'hidden';
			report_title.name = 't';
			report_title.value = document.getElementById('title').value;
		report_form.appendChild(report_title);
		
		var report_id = document.createElement('input');
			report_id.type = 'hidden';
			report_id.name = 'id';
			report_id.value = ACE_ID;
		report_form.appendChild(report_id);
		
		var report_data = document.createElement('input');
			report_data.type = 'hidden';
			report_data.name = 'evaluation';
			report_data.value = evaluationJSON;
		report_form.appendChild(report_data);
		
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
	function storeSavedJSON(evaluationJSON) {
		$.ajax(
		{
			url: 			'save.php',
			type:			'POST',
			data: 			jQuery.param({ 
								'u': ACE_USER,
								'c': ACE_USER_CO,
								't': document.getElementById('title').value,
								'id': ACE_ID,
								'evaluation': evaluationJSON,
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
						alert(response.error);
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
	
	
	function loadConformanceEvaluation(evaluationJSON) {
	
		if (!evaluationJSON.hasOwnProperty('category') || evaluationJSON.category != 'savedEvaluation') {
			alert('Invalid report - missing category identifier. Unable to load.');
			return;
		}
		
		/* set the success criteria */
		
		if (evaluationJSON.hasOwnProperty('conformance')) {
			for (var i = 0; i < evaluationJSON.conformance.length; i++) {
				document.querySelector('input[name="'+evaluationJSON.conformance[i].id+'"][value="'+ evaluationJSON.conformance[i].status + '"]').click();
				
				if (evaluationJSON.conformance[i].hasOwnProperty('error')) {
					document.getElementById(evaluationJSON.conformance[i].id+'-err').value = evaluationJSON.conformance[i].error;
				}
				
				if (evaluationJSON.conformance[i].hasOwnProperty('note')) {
					document.querySelector('input[name="'+evaluationJSON.conformance[i].id+'-note"]').click();
					document.getElementById(evaluationJSON.conformance[i].id+'-info').value = evaluationJSON.conformance[i].note;
				}
			}
		}
		
		/* load the discovery metadata */
		
		if (evaluationJSON.hasOwnProperty('discovery')) {
			var discovery_checkbox_fields = ['accessibilityFeature','accessibilityHazard','accessMode','accessibilityAPI','accessibilityControl'];
			
			discovery_checkbox_fields.forEach(function(id) {
				if (evaluationJSON.discovery.hasOwnProperty(id)) {
					setDiscoveryMetaCheckbox(id,evaluationJSON.discovery[id]);
				}
			});
			
			if (evaluationJSON.discovery.hasOwnProperty('accessibilitySummary')) {
				document.getElementById('accessibilitySummary').value = evaluationJSON.discovery.accessibilitySummary;
			}
			
			if (evaluationJSON.discovery.hasOwnProperty('accessModeSufficient')) {
				setSufficientModes(evaluationJSON.discovery.accessModeSufficient);
			}
		}
		
		/* load onix metadata */
		
		if (evaluationJSON.hasOwnProperty('distribution')) {
			if (evaluationJSON.distribution.hasOwnProperty('onix')) {
				for (var onix_id in evaluationJSON.distribution.onix) {
					if (onix_id == 0 || onix_id > 90) {
						document.getElementById('onix' + onix_id).value = evaluationJSON.distribution.onix[onix_id];
					}
					else {
						if (evaluationJSON.distribution.onix[onix_id]) {
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
			if (evaluationJSON.hasOwnProperty(key)) {
				text_fields[key].forEach(function(id) {
					document.getElementById(id).value = evaluationJSON[key][id];
				});
			}
		}
		
		if (evaluationJSON.hasOwnProperty('evaluation') && evaluationJSON.evaluation.hasOwnProperty('result')) {
			document.getElementById('conformance-result').value = evaluationJSON.evaluation.result;
			document.getElementById('conformance-result-status').textContent = smartConformance.STATUS[evaluationJSON.evaluation.result]
		}
		
		/* load configuration info */
		
		if (evaluationJSON.hasOwnProperty('configuration')) {
			document.querySelector('input[name="wcag-level"][value="' + evaluationJSON.configuration.wcag.level + '"]').click();
			
			if (evaluationJSON.configuration.wcag.show_aa && evaluationJSON.configuration.wcag.level != 'aa') {
				document.getElementById('show-aa').click();
			}
			
			if (evaluationJSON.configuration.wcag.show_aaa) {
				document.getElementById('show-aaa').click();
			}
			
			document.querySelector('input[name="epub-format"][value="' + evaluationJSON.configuration.epub_format + '"]').click();
			
			if (evaluationJSON.configuration.hasOwnProperty('exclusions') && evaluationJSON.configuration.exclusions) {
				evaluationJSON.configuration.exclusions.forEach(function(value) {
					document.querySelector('#exclusions input[value="' + value + '"]').click(); 
				});
			}
			
			if (evaluationJSON.configuration.hasOwnProperty('fallbacks') && evaluationJSON.configuration.fallbacks) {
				document.querySelector('#fallbacks').classList.add('visible');
				evaluationJSON.configuration.fallbacks.forEach(function(value) {
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
				smart_extensions[key].loadData(evaluationJSON);
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
	
		saveConformanceEvaluation: function(location) {
			saveConformanceEvaluation(location);
		},
		
		loadConformanceEvaluation: function(data){
			loadConformanceEvaluation(data);
		}
	}

})();
