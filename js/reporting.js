
'use strict';

var smartReport = (function(smartError,smartFormat,smartDiscovery,smartConformance,smartCertification) {
	
	var _reportOutputLocation = 'win';
	var _notesToDisplay = 'all';
	
	function validateConformanceReport() {
		
		smartError.clearAll();
		
		var is_valid = true;
		
		is_valid = validatePublicationMetadata() ? is_valid : false;
		
		is_valid = checkNoUnverifiedSC() ? is_valid : false;
		
		is_valid = smartCertification.validate({quiet: true}) ? is_valid : false;
		
		is_valid = smartDiscovery.validate({quiet: true}) ? is_valid : false;
		
		// validate user extensions
		if (Object.keys(extension).length > 0) {
			for (var key in extension) {
				is_valid = extension[key].validate() ? is_valid : false;
			}
		}
		
		if (!is_valid) {
			if (!confirm('Report did not validate successfully!\n\nClick Ok to generate anyway, or Cancel to exit.')) {
				return false;
			}
		}
		
		return true;
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
				meta_element.setAttribute('aria-invalid',true);
				meta_element.parentNode.classList.add(smartFormat.BG.ERR);
				smartError.logError({tab_id: 'start', element_id: meta_name, severity: 'err', message: 'The ' + required_fields[meta_name] + ' is a required field.'});
				is_valid = false;
			}
			
			else {
				meta_element.setAttribute('aria-invalid',false);
				meta_element.parentNode.classList.remove(smartFormat.BG.ERR);
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
					optional_elem.setAttribute('aria-invalid',true);
					optional_elem.parentNode.classList.add(smartFormat.BG.ERR);
					smartError.logError({tab_id: 'start', element_id: 'optional-meta', severity: 'err', message: 'Missing a colon separator on line ' + (i+1)});
					is_valid = false;
					meta_error = true;
				}
			}
			if (!meta_error) {
				optional_meta_element.setAttribute('aria-invalid',false);
				optional_meta_element.parentNode.classList.remove(smartFormat.BG.ERR);
			}
		}
		
		else {
			optional_meta_element.setAttribute('aria-invalid',false);
			optional_meta_element.parentNode.classList.remove(smartFormat.BG.ERR);
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
	
	function generateConformanceReport() {
		
		if (!validateConformanceReport()) {
			return;
		}
		
		var title = document.getElementById('title').value;
		
		var report_body = createReportBody();
		var report_title = 'EPUB Accessibility Conformance Report for ' + title;
		var report_timestamp = smartFormat.generateTimestamp('at');
		
		var logo = document.createElement('span');
		
		if (Object.keys(extension).length > 0) {
			for (var key in extension) {
				if (typeof extension[key].LOGO !== 'undefined' && extension[key].LOGO) {
					var logoLink = document.createElement('a');
						logoLink.setAttribute('href', extension[key].LOGO[2]);
					
					var logoImg = document.createElement('img');
						logoImg.setAttribute('src', extension[key].LOGO[0]);
						logoImg.setAttribute('alt', extension[key].LOGO[1]);
					
					logoLink.appendChild(logoImg);
					logo.appendChild(logoLink);
				}
			}
		}
		
		if (_reportOutputLocation == 'win') {
			var reportWin = window.open('report.html','reportWin');
				reportWin.addEventListener('load', function() { reportWin.init(report_title, logo.innerHTML, report_body, report_timestamp); });
		}
		
		else {
			var report_template = '';
			var xhr = new XMLHttpRequest();
			
			xhr.open("GET", 'report.html', true);
			
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4){
			    	report_template = xhr.responseText;
			    	report_template = report_template.replace('<title></title>', '<title>' + report_title + '</title>');
			    	report_template = report_template.replace('<main></main>', '<main>' + report_body + '</main>');
			    	report_template = report_template.replace('<span id="date-created"></span>', '<span id="date-created">' + report_timestamp + '</span>');
			    	report_template = report_template.replace(/<script type="text\/javascript">[\s\S]+?<\/script>\s*/i, '');
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
		
		// add the report summary
		reportBody.appendChild(createReportSummary());
		
		// create the detailed report
		var reportDetails = document.createElement('section');
			reportDetails.setAttribute('id', 'details');
			reportDetails.setAttribute('aria-label', 'Report Details');
		
		// add additional info details
		var additionalInfo = createReportAdditionalInfo({addedID: publicationInfo.addedID});
		
		// add test result details
		var testResults = createReportTestDetails();
		
		// add statistics to the additional info section
		additionalInfo.appendChild(formatPubInfoEntry({id: 'result', label: 'Statistics', value: createReportStats(testResults.count)}));
		
		reportDetails.appendChild(additionalInfo);
		reportDetails.appendChild(testResults.content);
		reportBody.appendChild(reportDetails);
		
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
		
		var info = {'creator': 'author', 'identifier': 'identifier', 'publisher': 'publisher'};
		
		// used to determine whether to add ID after title or in pub info section
		publicationInfo.addedID = false;
		
		for (var key in info) {
			var value = document.getElementById(key).value.trim();
			if (value != '') {
				if (key == 'identifier' && !value.match(/^(ISBN|ISSN|DOI)/i)) {
					if (value.match(/^97[89]/)) {
						value = 'ISBN ' + value;
					}
					else {
						publicationInfo.addedID = true;
						continue;
					}
				}
				publicationInfo.content.appendChild(formatTitleSubInfo(key, value, info[key]));
			}
		}
		
		return publicationInfo;
	}
	
	
	function createReportSummary() {
	
		var summary = document.createElement('section');
			summary.setAttribute('id', 'summary');
		
		var summaryTable = document.createElement('div');
			summaryTable.setAttribute('class', 'summaryTable');
		
		var summaryHD = document.createElement('h3');
		
		var summaryHD_col1 = document.createElement('span');
			summaryHD_col1.appendChild(document.createTextNode('Synopsis'));
		
		summaryHD.appendChild(summaryHD_col1);
		
		var summaryHD_col2 = document.createElement('span');
		
		summaryHD.appendChild(summaryHD_col2);
		
		summaryTable.appendChild(summaryHD);
		
		var wcag_conf = document.getElementById('conf-result').value;
		
		var conf_class = [];
			conf_class.incomplete = 'incomplete';
			conf_class.a = 'pass';
			conf_class.aa = 'pass';
			conf_class.fail = 'fail';
		
		summaryTable.appendChild(formatPubInfoEntry({id: 'conformance', label: 'Conformance', value: smartConformance.STATUS[wcag_conf], property: 'dcterms:conformsTo', value_bg_class: conf_class[wcag_conf]}));
	
		summaryTable.appendChild(formatPubInfoEntry({id: 'accessibilitySummary', label: 'Summary', value: document.getElementById('accessibilitySummary').value, property: 'accessibilitySummary'}));
		summaryTable.appendChild(formatPubInfoEntry({id: 'accessibilityFeatures', label: 'Features', value: listDiscoveryMeta('accessibilityFeature','accessibilityFeature')}));
		summaryTable.appendChild(formatPubInfoEntry({id: 'accessibilityHazards', label: 'Hazards', value: listDiscoveryMeta('accessibilityHazard','accessibilityHazard')}));
		summaryTable.appendChild(formatPubInfoEntry({id: 'accessModes', label: 'Access Mode(s)', value: listDiscoveryMeta('accessMode','accessMode')}));
		
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
		
		summaryTable.appendChild(formatPubInfoEntry({id: 'accessibilityAPI', label: 'Accessibility APIs', value: listDiscoveryMeta('accessibilityAPI','accessibilityAPI')}));
		summaryTable.appendChild(formatPubInfoEntry({id: 'accessibilityControl', label: 'Accessibility Control', value: listDiscoveryMeta('accessibilityControl','accessibilityControl')}));
		
		var certifier = document.getElementById('certifiedBy').value.trim();
		
		if (certifier != '') {
			summaryTable.appendChild(formatPubInfoEntry({id: 'certifiedBy', label: 'Evaluated by', value: certifier}));
		}
		
		var credential;
		
		var name = document.getElementById('credentialName').value.trim();
		var link = document.getElementById('credentialLink').value.trim();
		
		if (name && link) {
			credential = document.createElement('a');
			credental.setAttribute('href', link);
			credential.appendChild(document.createTextNode(name));
		}
		
		else if (name != '') {
			credential = document.createTextNode(name);
		}
		
		else if (link != '') {
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
		
		var additionalInfo = document.createElement('details');
			additionalInfo.setAttribute('class', 'info');
		
		var additionalInfoSummary = document.createElement('summary');
			additionalInfoSummary.appendChild(document.createTextNode('Additional Information'));
		
		additionalInfo.appendChild(additionalInfoSummary);
		
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
			result.content = document.createElement('details');
			result.content.setAttribute('id', 'conformance');
		
		result.count = { pass: 0, fail: 0, na: 0, unverified: 0 };
		
		var showAA = document.getElementById('show-aa').checked;
		var showAAA = document.getElementById('show-aaa').checked;
		
		var resultSummary = document.createElement('summary');
			resultSummary.appendChild(document.createTextNode('Detailed Conformance Results'));
		
		result.content.appendChild(resultSummary);
		
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
				note_input.setAttribute('onclick','smartConformance.showNote(this)');
			
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
	
	
	/* return discovery metadata sets as strings */
	
	function listDiscoveryMeta(id,prop) {
		var elemList = document.getElementById(id).getElementsByTagName('input');
		var str = '';
		
		for (var i = 0; i < elemList.length; i++) {
			if (elemList[i].checked) {
				str += '<span property="' + prop + '">' + elemList[i].parentNode.textContent.trim() + '</span>, ';
			}
		}
		
		str = str.replace(/, $/,'');
		
		return (str == '' ? (prop == 'accessibilityHazard' ? 'Not specified' : '') : str);
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
		
		var entry = document.createElement('p');
			entry.setAttribute('id', options.id);
		
		var label = document.createElement('span');
			label.setAttribute('class','label');
			label.appendChild(document.createTextNode(options.label));
		
		entry.appendChild(label);
		entry.appendChild(document.createTextNode(' '));
		
		var value;
		
		if (typeof(options.value === 'string')) {
			var value = document.createElement('span');
				value.setAttribute('class', options.value_bg_class ? 'value ' + options.value_bg_class : 'value');
			
			if (options.property) {
				value.setAttribute('property', options.property);
			}
			value.appendChild(document.createTextNode(options.value));
		}
		
		else {
			value = options.value;
		}
		
		entry.appendChild(value);
		
		return entry;
	}
	
	
	function formatTitleSubInfo(id, value, property) {
		var span = document.createElement('span');
			span.setAttribute('id', id);
			span.setAttribute('property', property);
			span.appendChild(document.createTextNode(value));
		return span;
	}
	
	
	return {
		generateConformanceReport: function() {
			generateConformanceReport();
		},
		
		addSuccessCriteriaReporting: function() {
			addSCStatusFields();
		},
		
		setReportOutputLocation: function(location) {
			_reportOutputLocation = location;
			document.getElementById('report-html').style.display = (location == 'win') ? 'none' : 'block';
			document.getElementById('popup-instructions').style.display = (location == 'box') ? 'none' : 'block';
		},
		
		setNoteOutput: function(code) {
			_notesToDisplay = code;
		}
	}

})(smartError,smartFormat,smartDiscovery,smartConformance,smartCertification);
