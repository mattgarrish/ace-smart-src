
'use strict';

/* 
 * 
 * smartReport
 * 
 * Controls the report generation.
 * 
 * Public functions:
 * 
 * - validateConformanceReport - validates the output report
 * 
 * - generateConformanceReport - creates the final output report
 * 
 * - addSuccessCriteriaReporting - dynamically adds the status and note fields to success criteria
 * 
 * - setReportOutputLocation - sets _reportOutputLocation - whether the user want the report output to a new window or textbox
 * 
 * - setNoteOutput - sets _notesToDisplay - which kinds of notes the user wants included in the report
 * 
 */

var smartReport = (function() {
	
	var _notesToDisplay = 'all';
	var _reportWin;
	var _smartExtensionTabs = new Array();
	
	
	function validateConformanceReport() {
		
		smartError.clearAll();
		
		var is_valid = true;
		
		is_valid = validatePublicationMetadata() ? is_valid : false;
		
		is_valid = checkNoUnverifiedSC() ? is_valid : false;
		
		is_valid = smartCertification.validateCertificationMetadata() ? is_valid : false;
		
		is_valid = smartDiscovery.validateDiscoveryMetadata() ? is_valid : false;
		
		// validate user extensions
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				is_valid = smart_extensions[key].validate() ? is_valid : false;
			}
		}
		
		return is_valid;
	}
	
	
	function validatePublicationMetadata() {
		var is_valid = true;
		
		is_valid = validateRequiredPubMetadata() ? is_valid : false;
		is_valid = validateOptionalPubMetadata() ? is_valid : false;
		
		return is_valid;
	}
	
	
	function validateRequiredPubMetadata() {
		var is_valid = true;
		
		var required_fields = {'title': 'title', 'modified': 'last modified date'};
		
		for (var meta_name in required_fields) {
			var meta_element = document.getElementById(meta_name);
			
			if (meta_element.value.trim() == '') {
				smartError.logError({tab_id: 'start', element_id: meta_name, severity: 'err', message: 'The ' + required_fields[meta_name] + ' is a required field.'});
				smartFormat.setFieldToError({id: meta_name, is_warning: false, highlight_parent: true});
				is_valid = false;
			}
			
			else {
				smartFormat.setFieldToPass({id: meta_name, highlight_parent: true});
			}
		}
		
		return is_valid;
	}
	
	
	function validateOptionalPubMetadata() {
		var is_valid = true;
		
		var optional_meta_element = document.getElementById('optional-meta');
		var optional_meta_value = optional_meta_element.value.trim();
		
		if (optional_meta_value != '') {
			var meta_lines = optional_meta_value.replace(/\r\n/g,'\n').split('\n');
			var meta_error = false;
			for (var i = 0; i < meta_lines.length; i++) {
				if (!meta_lines[i].match(/: /)) {
					smartError.logError({tab_id: 'start', element_id: 'optional-meta', severity: 'err', message: 'Missing a colon separator on line ' + (i+1)});
					smartFormat.setFieldToError({id: 'optional-meta', highlight_parent: true});
					is_valid = false;
					meta_error = true;
				}
			}
			if (!meta_error) {
				smartFormat.setFieldToPass({id: 'optional-meta', highlight_parent: true});
			}
		}
		
		else {
			smartFormat.setFieldToPass({id: 'optional-meta', highlight_parent: true});
		}
		
		return is_valid;
	}
	
	
	function checkNoUnverifiedSC() {
		var unverified_selector = 'section.a input[value="unverified"]:checked';
			unverified_selector += smartWCAG.WCAGLevel == 'a' ? '' : ', section.aa input[value="unverified"]:checked';
		
		var unverified_success_criteria = document.querySelectorAll(unverified_selector);
		
		if (unverified_success_criteria) {
			for (var i = 0; i < unverified_success_criteria.length; i++) {
				smartError.logError({tab_id: 'conformance', element_id: unverified_success_criteria[i].name, severity: 'err', message: 'Success criteria ' + unverified_success_criteria[i].name.replace('sc-','') + ' is unverified.'});
			}
			
			return false;
		}
		
		return true;
	}
	
	
	
	
	
	/* 
	 * Creates the final conformance report for the publication
	 */
	
	function generateConformanceReport(reportOutputType) {
		
		if (!validateConformanceReport()) {
			if (!confirm('Report did not validate successfully!\n\nClick Ok to generate anyway, or Cancel to exit.')) {
				return;
			}
		}
		
		var title = document.getElementById('title').value;
		
		var report_body = createReportBody();
		var report_title = 'EPUB Accessibility Conformance Report for ' + title;
		var report_timestamp = smartFormat.generateTimestamp('at');
		
		var logo = document.createElement('span');
		
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				if (typeof smart_extensions[key].LOGO !== 'undefined' && smart_extensions[key].LOGO.length == 3) {
					var logoLink = document.createElement('a');
						logoLink.setAttribute('href', smart_extensions[key].LOGO[2]);
					
					var logoImg = document.createElement('img');
						logoImg.setAttribute('src', smart_extensions[key].LOGO[0]);
						logoImg.setAttribute('alt', smart_extensions[key].LOGO[1]);
					
					logoLink.appendChild(logoImg);
					logo.appendChild(logoLink);
				}
			}
		}
		
		if (reportOutputType == 'preview') {
			var report_form = document.createElement('form');
				report_form.target = '_blank';    
				report_form.method = 'POST';
				report_form.action = 'report.php';
			
			var report_title_input = document.createElement('input');
				report_title_input.type = 'hidden';
				report_title_input.name = 'title';
				report_title_input.value = report_title;
			report_form.appendChild(report_title_input);
			
			var report_logo_input = document.createElement('input');
				report_logo_input.type = 'hidden';
				report_logo_input.name = 'logo';
				report_logo_input.value = logo.innerHTML;
			report_form.appendChild(report_logo_input);
			
			var report_body_input = document.createElement('input');
				report_body_input.type = 'hidden';
				report_body_input.name = 'report';
				report_body_input.value = report_body;
			report_form.appendChild(report_body_input);
			
			var report_timestamp_input = document.createElement('input');
				report_timestamp_input.type = 'hidden';
				report_timestamp_input.name = 'timestamp';
				report_timestamp_input.value = report_timestamp;
			report_form.appendChild(report_timestamp_input);
			
			document.body.appendChild(report_form);
			report_form.submit();
			report_form.parentNode.removeChild(report_form);
		}
		
		else {
			var report_template = '';
			var xhr = new XMLHttpRequest();
			
			xhr.open("GET", 'report.php', true);
			
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4){
			    	report_template = xhr.responseText;
			    	report_template = report_template.replace('<title></title>', '<title>' + report_title + '</title>');
			    	report_template = report_template.replace('<main></main>', '<main>' + report_body + '</main>');
			    	report_template = report_template.replace('<span id="date-created"></span>', '<span id="date-created">' + report_timestamp + '</span>');
			    	document.getElementById('report-html').value = report_template;
			    }
			}
			
			xhr.send();
		}
	}
	
	
	function createReportBody() {
		var reportBody = document.createElement('body');
		
		// add the header
		reportBody.appendChild(createReportHeader());
		
		// add the publication info below the header
		var publicationInfo = createReportPublicationInfo();
			reportBody.appendChild(publicationInfo.content);
		
		// add the tab list
		var tab_list = document.createElement('ul');
			tab_list.setAttribute('class','js-tablist');
			tab_list.setAttribute('data-existing-hx','h3');
		
		var tabs = [{id: 'summary', label: 'Summary'}, {id: 'conformance', label: 'Conformance'}];
		
		if (_smartExtensionTabs.length > 0) {
			_smartExtensionTabs.forEach(function(tab) {tabs.push(tab); });
		}
		
		tabs.push({id: 'additional-info', label: 'Additional Info'});
		
		tabs.forEach(function(tab) {
			var tab_list_item = document.createElement('li');
				tab_list_item.setAttribute('class','js-tablist__item');
			
			var tab_link = document.createElement('a');
				tab_link.setAttribute('href','#'+tab.id);
				tab_link.setAttribute('id','label_'+tab.id);
				tab_link.setAttribute('class','js-tablist__link');
				tab_link.appendChild(document.createTextNode(tab.label));
			
			tab_list_item.appendChild(tab_link);
			tab_list.appendChild(tab_list_item);
		});
		
		reportBody.appendChild(tab_list);
		
		// add the report summary
		reportBody.appendChild(createReportSummary());
		
		// add test result details
		var testResults = createReportTestDetails();
		
		reportBody.appendChild(testResults.content);
		
		// add extensions
		if (_smartExtensionTabs.length > 0) {
			_smartExtensionTabs.forEach(function(tab) {
				if (smart_extensions.hasOwnProperty(tab.id)) {
					reportBody.appendChild(smart_extensions[tab.id].generateReport());
				}
			});
		}
		
		// add additional info details
		var additionalInfo = createReportAdditionalInfo({addedID: publicationInfo.addedID});
		
		// add statistics to the additional info section
		additionalInfo.appendChild(formatPubInfoEntry({id: 'result', label: 'Statistics', value: createReportStats(testResults.count)}));
		
		reportBody.appendChild(additionalInfo);
		
		return reportBody.innerHTML;
	}
	
	
	function createReportHeader() {
		var reportHD = document.createElement('h2');
			reportHD.setAttribute('id', 'title');
			reportHD.setAttribute('property', 'name');
			reportHD.appendChild(document.createTextNode(document.getElementById('title').value.trim()))
		return reportHD;
	}
	
	
	function createReportPublicationInfo() {
		var publicationInfo = {};
		
		publicationInfo.content = document.createElement('div');
			publicationInfo.content.setAttribute('class', 'pubinfo');
		
		var info_fields = [{id: 'creator', property: 'author', pub_value: document.getElementById('creator').value.trim()}, {id: 'identifier', property: 'identifier', pub_value: document.getElementById('identifier').value.trim()}, {id: 'publisher', property: 'publisher', pub_value: document.getElementById('publisher').value.trim()}];
		
		// used to determine whether to add ID after title or in pub info section
		var addedID = false;
		
		for (var i = 0; i < info_fields.length; i++) {
		
			if (info_fields[i].pub_value) {
				
				var field_value = info_fields[i].pub_value;
				
				// mark whether the id has already been added
				if (info_fields[i].id == 'identifier') {
					if (!info_fields[i].pub_value.match(/^(ISBN|ISSN|DOI)/i)) {
						if (info_fields[i].pub_value.match(/^97[89]/)) {
							field_value = 'ISBN ' + info_fields[i].pub_value;
						}
						else {
							continue;
						}
					}
					publicationInfo.addedID = true;
				}
				
				publicationInfo.content.appendChild(formatReportTitleSubSpan({key: info_fields[i].id, value: field_value, property: info_fields[i].property}));
				if (((i+1) < info_fields.length) && info_fields[i+1].pub_value) { publicationInfo.content.appendChild(document.createTextNode(' | ')); }
			}
		}
		
		return publicationInfo;
	}
	
	
	function createReportSummary() {
	
		var summary = document.createElement('section');
			summary.setAttribute('id', 'summary');
			summary.setAttribute('class', 'js-tabcontent');
		
		var summaryHD = document.createElement('h3');
			summaryHD.appendChild(document.createTextNode('Summary'));
		
		summary.appendChild(summaryHD);
		
		var summaryTable = document.createElement('div');
			summaryTable.setAttribute('class', 'summaryTable');
		
		var wcag_conf = document.getElementById('conformance-result').value;
		
		var conf_class = [];
			conf_class.incomplete = 'incomplete';
			conf_class.a = 'pass';
			conf_class.aa = 'pass';
			conf_class.fail = 'fail';
		
		summaryTable.appendChild(formatPubInfoEntry({id: 'conformance-result', label: 'Conformance', value: smartConformance.STATUS[wcag_conf], property: 'dcterms:conformsTo', value_bg_class: conf_class[wcag_conf]}));
	
		summaryTable.appendChild(formatPubInfoEntry({id: 'accessibilitySummary', label: 'Summary', value: document.getElementById('accessibilitySummary').value, property: 'accessibilitySummary'}));
		summaryTable.appendChild(formatPubInfoEntry({id: 'accessibilityFeatures', label: 'Features', value: compileCheckboxValues('accessibilityFeature')}));
		summaryTable.appendChild(formatPubInfoEntry({id: 'accessibilityHazards', label: 'Hazards', value: compileCheckboxValues('accessibilityHazard')}));
		summaryTable.appendChild(formatPubInfoEntry({id: 'accessModes', label: 'Access Mode(s)', value: compileCheckboxValues('accessMode')}));
		
		var suffSet = document.querySelectorAll('fieldset#accessModeSufficient fieldset');
		
		var sufficient_ul = document.createElement('ul');
		
		for (var i = 0; i < suffSet.length; i++) {
			var suffMode = suffSet[i].querySelectorAll('input:checked');
			if (suffMode.length > 0) {
				var li = document.createElement('li')
				for (var j = 0; j < suffMode.length; j++) {
					li.appendChild(document.createTextNode(suffMode[j].value));
					if (j != suffMode.length-1) {
						li.appendChild(document.createTextNode(', '));
					}
				}
				sufficient_ul.appendChild(li);
			}
		}
		
		if (sufficient_ul.childElementCount > 0) {
			var sufficientModes = document.createElement('div');
				sufficientModes.setAttribute('id', 'accessModeSufficient');
			
			var label = document.createElement('div');
				label.setAttribute('class', 'label');
				label.appendChild(document.createTextNode('Sufficient Mode(s):'))
			
			sufficientModes.appendChild(label);
			sufficientModes.appendChild(document.createTextNode(' '));
			
			var value = document.createElement('div');
				value.setAttribute('class', 'value');
				value.setAttribute('property', 'accessModeSufficient');
				value.appendChild(sufficient_ul);
			
			sufficientModes.appendChild(value);
			
			summaryTable.appendChild(sufficientModes);
		}
		
		summaryTable.appendChild(formatPubInfoEntry({id: 'accessibilityAPI', label: 'Accessibility APIs', value: compileCheckboxValues('accessibilityAPI')}));
		summaryTable.appendChild(formatPubInfoEntry({id: 'accessibilityControl', label: 'Accessibility Control', value: compileCheckboxValues('accessibilityControl')}));
		
		var certifier = document.getElementById('certifiedBy').value.trim();
		
		if (certifier != '') {
			summaryTable.appendChild(formatPubInfoEntry({id: 'certifiedBy', label: 'Evaluated by', value: certifier}));
		}
		
		var credential;
		
		var link = document.getElementById('certifierCredential').value.trim();
		
		if (link) {
			credential = document.createElement('a');
			credental.setAttribute('href', link);
			credential.appendChild(document.createTextNode(link));
		}
		
		if (credential) {
			summaryTable.appendChild(formatPubInfoEntry({id: 'credential', label: 'Additional Credential(s)', value: credential}));
		}
		
		summary.appendChild(summaryTable);
		
		return summary;
	}
	
	
	function createReportAdditionalInfo(options) {
		options = typeof(options) === 'object' ? options : {};
		options.addedID = options.hasOwnProperty('addedID') ? options.addedID : false;
		
		var additionalInfo = document.createElement('section');
			additionalInfo.setAttribute('id','additional-info');
			additionalInfo.setAttribute('class', 'info js-tabcontent');
		
		var additionalInfoHD = document.createElement('h3');
			additionalInfoHD.appendChild(document.createTextNode('Additional Information'));
		
		additionalInfo.appendChild(additionalInfoHD);
		
		// add epub version
		additionalInfo.appendChild(formatPubInfoEntry({id: 'format', label: 'Format', value: 'EPUB ' + document.querySelector('input[name="epub-format"]:checked').value}));
		
		if (!options.addedID) {
			additionalInfo.appendChild(formatPubInfoEntry({id: 'identifier', label: 'Identifier', value: document.getElementById('identifier').value.trim()}));
		}
		
		additionalInfo.appendChild(formatPubInfoEntry({id: 'modified', label: 'Last Modified', value: document.getElementById('modified').value.trim()}));
		additionalInfo.appendChild(formatPubInfoEntry({id: 'date', label: 'Published', value: document.getElementById('date').value.trim()}));
		additionalInfo.appendChild(formatPubInfoEntry({id: 'description', label: 'Description', value: document.getElementById('description').value.trim()}));
		additionalInfo.appendChild(formatPubInfoEntry({id: 'subject', label: 'Subject', value: document.getElementById('subject').value.trim()}));
		
		var optional_meta = document.getElementById('optional-meta').value.trim();
		
		if (optional_meta != '') {
			var meta = optional_meta.replace(/\r\n/g,'\n').split('\n');
			for (var i = 0; i < meta.length; i++) {
				var part = meta[i].split(': ');
				additionalInfo.appendChild(formatPubInfoEntry({id: part[0].toLowerCase().replace(/\s/g,''), label: part[0], value: part[1]}));
			}
		}
		
		return additionalInfo;
	}
	
	
	function createReportTestDetails() {
	
		var result = {};
			result.content = document.createElement('section');
			result.content.setAttribute('id', 'conformance');
			result.content.setAttribute('class', 'js-tabcontent');
		
		var resultHD = document.createElement('h3');
			resultHD.appendChild(document.createTextNode('Conformance Results'));
		
		result.content.appendChild(resultHD);
		
		result.count = { pass: 0, fail: 0, na: 0, unverified: 0 };
		
		var showAA = document.getElementById('show-aa').checked;
		var showAAA = document.getElementById('show-aaa').checked;
		
		var resultTable = document.createElement('table');
		var resultThead = document.createElement('thead');
		var resultTheadRow = document.createElement('tr');
		
		var resultTheadSC = document.createElement('th');
			resultTheadSC.appendChild(document.createTextNode('Success Criteria'));
		resultTheadRow.appendChild(resultTheadSC);
		
		var resultTheadLevel = document.createElement('th');
			resultTheadLevel.appendChild(document.createTextNode('Level'));
		resultTheadRow.appendChild(resultTheadLevel);
		
		var resultTheadResult = document.createElement('th');
			resultTheadResult.appendChild(document.createTextNode('Result'));
		resultTheadRow.appendChild(resultTheadResult);
		
		resultThead.appendChild(resultTheadRow);
		resultTable.appendChild(resultThead);
		
		var resultTbody = document.createElement('tbody');
		
		var criteria = document.querySelectorAll('.a, .aa, .aaa, .epub');
		
		for (var i = 0; i < criteria.length; i++) {
			
			var conf_level = criteria[i].classList.contains('a') ? 'a' : (criteria[i].classList.contains('aa') ? 'aa' : (criteria[i].classList.contains('aaa') ? 'aaa' : 'epub'));
			
			// whether to include in stats for meeting the user specified wcag level
			var log = (conf_level == 'aaa' || smartWCAG.WCAGLevel == 'a' && conf_level != 'a') ? false : true;
			
			var status = document.querySelector('input[name="'+criteria[i].id+'"]:checked').value;
			
			// skip AA (if A conformance) and AAA (all the time) SCs if not selected to show in config options
			if ((conf_level == 'aa' && smartWCAG.WCAGLevel == 'a' && !showAA) || (conf_level == 'aaa' && !showAAA)) {
				continue;
			}
			
			// skip reporting AA (if A conformance) and AAA (all the time) SCs if they are n/a
			if ((conf_level == 'aaa' || (conf_level == 'aa' && smartWCAG.WCAGLevel == 'a'))
					&& (status == 'unverified')) {
				continue;
			}
			
			var resultRow = document.createElement('tr');
			
			var resultColSC = document.createElement('th');
				resultColSC.appendChild(document.createTextNode((criteria[i].getElementsByClassName('label'))[0].textContent));
			resultRow.appendChild(resultColSC);
			
			var resultColLevel = document.createElement('td');
				resultColLevel.setAttribute('class', 'lvl');
				resultColLevel.appendChild(document.createTextNode(conf_level.toUpperCase()));
			resultRow.appendChild(resultColLevel);
			
			var resultColStatus = document.createElement('td');
				resultColStatus.setAttribute('class', status);
			
			var resultColStatusLabel = document.createElement('p');
				resultColStatusLabel.setAttribute('class', 'label');
			
			if (status == 'pass') {
				resultColStatusLabel.appendChild(document.createTextNode('Pass'));
				resultColStatus.appendChild(resultColStatusLabel);
				if (log) {
					result.count.pass += 1;
				}
			}
			
			else if (status == 'fail') {
				var err = document.getElementById(criteria[i].id+'-err').value;
				resultColStatusLabel.appendChild(document.createTextNode('Fail'));
				resultColStatus.appendChild(resultColStatusLabel);
				
				// add the reason 
				if ((err != '') && (_notesToDisplay == 'all' || _notesToDisplay == 'failures')) {
					var lines = err.replace(/</g,'&lt;').trim().split(/[\r\n]+/);
					lines.forEach(function(line) {
						if (line) {
							var notePara = document.createElement('p');
								notePara.appendChild(document.createTextNode(line));
							resultColStatus.appendChild(notePara);
						}
					});
				}
				
				if ((criteria['name'] != 'EPUB') || ((criteria['name'] == 'EPUB') && (criteria[i].id != 'eg-2'))) {
					if (log) {
						result.count.fail += 1;
					}
				}
			}
			
			else if (status == 'na') {
				resultColStatusLabel.appendChild(document.createTextNode('Not Applicable'));
				resultColStatus.appendChild(resultColStatusLabel);
				if (log) {
					result.count.na += 1;
				}
			}
			
			else {
				resultColStatusLabel.appendChild(document.createTextNode('Not checked'));
				resultColStatus.appendChild(resultColStatusLabel);
				if (log) {
					result.count.unverified += 1;
				}
			}
			
			if (_notesToDisplay == 'all' || _notesToDisplay == 'notes') {
				if ((document.getElementsByName(criteria[i].id+'-note'))[0].checked) {
					var noteLabel = document.createElement('p');
						noteLabel.setAttribute('class', 'label');
						noteLabel.appendChild(document.createTextNode('Additional Info:'));
					resultColStatus.appendChild(noteLabel);
					
					var noteValue = document.createElement('p');
						noteValue.setAttribute('class', 'value');
						noteValue.appendChild(document.createTextNode(document.getElementById(criteria[i].id+'-info').value));
					resultColStatus.appendChild(noteValue);
				}
			}
			
			resultRow.appendChild(resultColStatus);
			resultTbody.appendChild(resultRow);
		}
		
		resultTable.appendChild(resultTbody);
		result.content.appendChild(resultTable);
		
		return result;
	}
	
	
	function createReportStats(count) {
		var stats = '';
		
		if (count.fail) {
			stats += count.fail + ' fail, ';
		}
		
		if (count.unverified) {
			stats += count.unverified + ' unverified, '; 
		}
		
		stats += count.pass + ' pass';
		
		if (count.na) {
			stats += ', ' + count.na + ' not applicable';
		}
		
		return stats;
	}
	
	
	/* return discovery metadata sets */
	function compileCheckboxValues(id) {
		var checkboxes = document.getElementById(id).querySelectorAll('input:checked');
		
		var value_list = document.createElement('ul');
		
		for (var i = 0; i < checkboxes.length; i++) {
			var property_li = document.createElement('li');
				property_li.setAttribute('property', id);
				property_li.appendChild(document.createTextNode(checkboxes[i].parentNode.textContent.trim()));
			
			value_list.appendChild(property_li); 
		}
		
		if (!value_list.hasChildNodes()) {
			if (id == 'accessibilityHazard') {
				return 'not specified';
			}
		}
		
		else {
			return value_list;
		}
		
		return '';
	}
	
	
	
	function formatPubInfoEntry(options) {
		options = typeof(options) === 'object' ? options : {};
		options.id = options.id ? options.id : '';
		options.label = options.label ? options.label : '';
		options.property = options.property ? options.property : '';
		options.value = options.value ? options.value : '';
		options.value_bg_class = options.value_bg_class ?  ' ' + options.value_bg_class : '';
		
		if (!options.value) {
			return document.createTextNode(' ');
		}
		
		var entry = document.createElement('div');
			entry.setAttribute('id', options.id);
		
		var label = document.createElement('div');
			label.setAttribute('class','label');
			label.appendChild(document.createTextNode(options.label+':'));
		
		entry.appendChild(label);
		entry.appendChild(document.createTextNode(' '));
		
		var value;
		
		if (typeof(options.value) === 'string') {
			value = document.createElement('div');
			value.setAttribute('class', options.value_bg_class ? 'value ' + options.value_bg_class : 'value');
			
			if (options.property) {
				value.setAttribute('property', options.property);
			}
			value.appendChild(document.createTextNode(options.value));
		}
		
		else if (options.value.tagName.toLowerCase() == 'ul') {
			value = document.createElement('div');
			value.setAttribute('class', options.value_bg_class ? 'value ' + options.value_bg_class : 'value');
			value.appendChild(options.value);
		}
		
		else {
			value = options.value;
		}
		
		entry.appendChild(value);
		
		return entry;
	}
	
	
	function formatReportTitleSubSpan(options) {
		var span = document.createElement('span');
			span.setAttribute('id', options.property);
			
			if (options.property) {
				span.setAttribute('property', options.property);
			}
			
			span.appendChild(document.createTextNode(options.value));
		return span;
	}
	
	
	
	
	
	/* 
	 * Dynamically generates the status radio buttons and note fields for 
	 * evaluating the success criteria
	 */
	
	function addSCStatusFields() {
	
		var sc = document.querySelectorAll('.a, .aa, .aaa, .epub');
		
		for (var i = 0; i < sc.length; i++) {
		
			/* add wrapper div with reporting class for hiding later */
			var report = document.createElement('div');
				report.setAttribute('class','reporting');
			
			/*  add the status radio buttons */
			var status = document.createElement('fieldset');
				status.setAttribute('class','flat status');
			
			var status_legend = document.createElement('legend');
				status_legend.appendChild(document.createTextNode('Status:'));
			
			status.appendChild(status_legend);
			
			var stats = {'unverified': 'Unverified', 'pass': 'Pass', 'fail': 'Fail', 'na': 'N/A'};
			
			for (var stat in stats) {
				var status_label = document.createElement('label');
				var status_input = document.createElement('input');
					status_input.setAttribute('type','radio');
					status_input.setAttribute('name', sc[i].id);
					status_input.setAttribute('value',stat);
					status_input.setAttribute('class','sc_status');
				
				if (stat == 'unverified') {
					status_input.setAttribute('checked','checked');
				}
				
				status_label.appendChild(status_input);
				status_label.appendChild(document.createTextNode(' ' + stats[stat]));
				status.appendChild(status_label);
				status.appendChild(document.createTextNode(' '));
			}
			
			/* add the failure textarea */
			
			var err = document.createElement('div');
				err.setAttribute('id',sc[i].id+'-fail');
				err.setAttribute('class','failure');
			
			var err_p = document.createElement('p');
			
			var err_label = document.createElement('label');
				err_label.setAttribute('for',sc[i].id+'-err');
				err_label.appendChild(document.createTextNode('Describe failure(s):'));
			
			err.appendChild(err_label);
			
			var err_textarea = document.createElement('textarea');
				err_textarea.setAttribute('id',sc[i].id+'-err');
				err_textarea.setAttribute('rows','5');
				err_textarea.setAttribute('cols','80');
			
			err.appendChild(err_textarea);
			
			status.appendChild(err);
			
			report.appendChild(status);
			
			/* add the note checkbox and textarea */
			
			var note_p = document.createElement('p');
			
			var note_label = document.createElement('label');
			
			var note_input = document.createElement('input');
				note_input.setAttribute('type','checkbox');
				note_input.setAttribute('name',sc[i].id+'-note');
				note_input.setAttribute('class','show-note');
			
			note_label.appendChild(note_input);
			note_label.appendChild(document.createTextNode(' Add Note'));
			
			note_p.appendChild(note_label);
			
			report.appendChild(note_p);
			
			var note_div = document.createElement('div');
				note_div.setAttribute('id',sc[i].id+'-note');
				note_div.setAttribute('class','info');
			
			var note_textarea = document.createElement('textarea');
				note_textarea.setAttribute('id',sc[i].id+'-info');
				note_textarea.setAttribute('rows','5');
				note_textarea.setAttribute('cols','80');
				note_textarea.setAttribute('aria-label','Note');
			
			note_div.appendChild(note_textarea);
			
			report.appendChild(note_div);
			
			sc[i].appendChild(report);
		}
	}
	
	
	
	return {
		addExtensionTab: function(tab_info) {
			_smartExtensionTabs.push(tab_info);
		},
		
		validateConformanceReport: function() {
			validateConformanceReport();
		},
		
		generateConformanceReport: function(location) {
			generateConformanceReport(location);
		},
		
		addSuccessCriteriaReporting: function() {
			addSCStatusFields();
		},
		
		setNoteOutput: function(code) {
			_notesToDisplay = code;
		}
	}

})();
