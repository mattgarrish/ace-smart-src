
'use strict';

var smartReport = (function(smartError,smartFormat,smartDiscovery,smartConformance,smartCertification) {
	
	var _reportOutputLocation = 'win';
	var _notesToDisplay = 1; // all - show all; failures - show only failures; notes - show only general; none - hide all
	
	function validateConformanceReport() {
		
		var error = false;
		
		/* clear the error pane */
		smartError.clearAll();
		
		/* validate the title/modified date */
		var required_meta = {'title': 'title', 'modified': 'last modified date'};
		
		for (var meta_name in required_meta) {
			var meta_element = document.getElementById(meta_name);
			
			if (meta_element.value.trim() == '') {
				meta_element.setAttribute('aria-invalid',true);
				meta_element.parentNode.classList.add(smartFormat.BG.ERR);
				smartError.logError({tab_id: 'start', element_id: meta_name, severity: 'err', message: 'The ' + required_meta[meta_name] + ' is a required field.'});
				error = true;
			}
			
			else {
				meta_element.setAttribute('aria-invalid',false);
				meta_element.parentNode.classList.remove(smartFormat.BG.ERR);
			}
		}
		
		/* validate the optional metadata field */
		
		var optional_elem = document.getElementById('optional-meta');
		var optional_meta_value = optional_elem.value.trim();
		
		if (optional_meta_value != '') {
			var meta_lines = optional_meta_value.replace(/\r\n/g,'\n').split('\n');
			var meta_error = false;
			for (var i = 0; i < meta_lines.length; i++) {
				if (!meta_lines[i].match(/: /)) {
					optional_elem.setAttribute('aria-invalid',true);
					optional_elem.parentNode.classList.add(smartFormat.BG.ERR);
					smartError.logError({tab_id: 'start', element_id: 'optional-meta', severity: 'err', message: 'Missing a colon separator on line ' + (i+1)});
					error = true;
					meta_error = true;
				}
			}
			if (!meta_error) {
				optional_elem.setAttribute('aria-invalid',false);
				optional_elem.parentNode.classList.remove(smartFormat.BG.ERR);
			}
		}
		
		else {
			optional_elem.setAttribute('aria-invalid',false);
			optional_elem.parentNode.classList.remove(smartFormat.BG.ERR);
		}
		
		var unverified_selector = 'section.a input[value="unverified"]:checked';
			unverified_selector += smartWCAG.WCAGLevel == 'a' ? '' : ', section.aa input[value="unverified"]:checked';
		
		var unverified_success_criteria = document.querySelectorAll(unverified_selector);
		
		if (unverified_success_criteria) {
			for (var i = 0; i < unverified_success_criteria.length; i++) {
				smartError.logError({tab_id: 'conformance', element_id: unverified_success_criteria[i].name, severity: 'err', message: 'Success criteria ' + unverified_success_criteria[i].name.replace('sc-','') + ' is unverified.'});
			}
		}
		
		error = smartCertification.validate(true) ? error : true;
		
		error = smartDiscovery.validate(true) ? error : true;
		
		// validate user extensions
		if (Object.keys(extension).length > 0) {
			for (var key in extension) {
				error = extension[key].validate() ? error : true;
			}
		}
		
		if (error) {
			if (!confirm('Report did not validate successfully!\n\nClick Ok to generate anyway, or Cancel to exit.')) {
				return false;
			}
		}
		
		return true;
	}
	
	
	function generateConformanceReport() {
		
		if (!validateConformanceReport()) {
			return;
		}
		
		var title = document.getElementById('title').value;
		
		var reportBody = '<h2 id="title" property="name">' + document.getElementById('title').value.trim() + '</h2>';
		
		/* add publication info */
		
		reportBody += '<div class="pubinfo">';
		
		var info = {'creator': 'author', 'identifier': 'identifier', 'publisher': 'publisher'};
		
		// used to determine whether to add ID after title or in pub info section
		var IDOnTop = false;
		
		for (var key in info) {
			var value = document.getElementById(key).value.trim();
			if (value != '') {
				if (key == 'identifier' && !value.match(/^(ISBN|ISSN|DOI)/i)) {
					if (value.match(/^97[89]/)) {
						value = 'ISBN ' + value;
					}
					else {
						IDOnTop = true;
						continue;
					}
				}
				reportBody += formatTitleSubInfo(key,value,info[key]);
			}
		}
		
		reportBody = reportBody.replace(/ \| $/,'');
		
		reportBody += '</div>\n';
		
		var reportSummary = '<section id="summary">\n'
			reportSummary += '<div class="summaryTable">\n';
			reportSummary += '<h3><span>Synopsis</span><span></span></h3>';
			
		var wcag_conf = document.getElementById('conf-result').value;
		
		var conf_class = [];
			conf_class.incomplete = 'incomplete';
			conf_class.a = 'pass';
			conf_class.aa = 'pass';
			conf_class.fail = 'fail';
		
		reportSummary += formatPubInfoEntry({id: 'conformance', label: 'Conformance', value: smartConformance.STATUS[wcag_conf], property: 'dcterms:conformsTo', value_bg_class: conf_class[wcag_conf]});
	
		reportSummary += formatPubInfoEntry({id: 'accessibilitySummary', label: 'Summary', value: document.getElementById('accessibilitySummary').value, property: 'accessibilitySummary'});
		reportSummary += formatPubInfoEntry({id: 'accessibilityFeatures', label: 'Features', value: listDiscoveryMeta('accessibilityFeature','accessibilityFeature')});
		reportSummary += formatPubInfoEntry({id: 'accessibilityHazards', label: 'Hazards', value: listDiscoveryMeta('accessibilityHazard','accessibilityHazard')});
		reportSummary += formatPubInfoEntry({id: 'accessModes', label: 'Access Mode(s)', value: listDiscoveryMeta('accessMode','accessMode')});
		
		var suffSet = document.querySelectorAll('fieldset#accessModeSufficient fieldset');
		var items = '';
		
		for (var i = 0; i < suffSet.length; i++) {
			var suffMode = suffSet[i].querySelectorAll('input:checked');
			if (suffMode.length > 0) {
				items += '<li>';
				for (var j = 0; j < suffMode.length; j++) {
					items += suffMode[j].value;
					if (j != suffMode.length-1) {
						items += ', ';
					}
				}
				items += '</li>';
			}
		}
		
		if (items != '') {
			reportSummary += '<div id="accessModeSufficient"><div class="label">Sufficient Mode(s):</div> <div class="value" property="accessModeSufficient"><ul>' + items + '</ul></div></div>\n'
		}
		
		reportSummary += formatPubInfoEntry({id: 'accessibilityAPI', label: 'Accessibility APIs', value: listDiscoveryMeta('accessibilityAPI','accessibilityAPI')});
		reportSummary += formatPubInfoEntry({id: 'accessibilityControl', label: 'Accessibility Control', value: listDiscoveryMeta('accessibilityControl','accessibilityControl')});
		
		var certifier = document.getElementById('certifiedBy').value.trim();
		
		if (certifier != '') {
			reportSummary += formatPubInfoEntry({id: 'certifiedBy', label: 'Evaluated by', value: certifier});
		}
		
		// reportSummary += '<p id="credential"><span class="label">Credential:</span> <span class="value"><a href="http://www.daisy.org/ace/certified">DAISY Ace Certified</a>';
		
		//var credNum = document.querySelectorAll('fieldset.credential').length;
		
		var cred = '';
		
		//for (var i = 1; i <= credNum; i++) {
			var name = document.getElementById('credentialName').value.trim();
			var link = document.getElementById('credentialLink').value.trim();
			
			if (name != '' && link != '') {
				cred += '<br><a href="' + link + '">' + name + '</a>';
			}
			
			else if (name != '') {
				cred += '<br>' + name;
			}
			
			else if (link != '') {
				cred += '<br><a href="' + link + '">' + link + '</a>';
			}
		//}
		
		if (cred != '') {
			reportSummary += formatPubInfoEntry({id: 'credential', label: 'Additional Credential(s)', value: cred});
		}
		
		reportSummary += '\n</div>\n</section>\n';
	
		var reportDetails = '<section id="details" aria-label="Report Details">\n';
			reportDetails += '<details class="info">\n<summary>Additional Information</summary>\n';
		
		// add epub version
		reportDetails += formatPubInfoEntry({id: 'format', label: 'Format', value: 'EPUB ' + document.querySelector('input[name="epub-format"]:checked').value});
		
		if (IDOnTop) {
			reportDetails += formatPubInfoEntry({id: 'identifier', label: 'Identifier', value: document.getElementById('identifier').value.trim()});
		}
		
		reportDetails += formatPubInfoEntry({id: 'modified', label: 'Last Modified', value: document.getElementById('modified').value.trim()});
		reportDetails += formatPubInfoEntry({id: 'date', label: 'Published', value: document.getElementById('date').value.trim()});
		reportDetails += formatPubInfoEntry({id: 'description', label: 'Description', value: document.getElementById('description').value.trim()});
		reportDetails += formatPubInfoEntry({id: 'subject', label: 'Subject', value: document.getElementById('subject').value.trim()});
		
		var optional_meta = document.getElementById('optional-meta').value.trim();
		
		if (optional_meta != '') {
			var meta = optional_meta.replace(/\r\n/g,'\n').split('\n');
			for (var i = 0; i < meta.length; i++) {
				var part = meta[i].split(': ');
				reportDetails += formatPubInfoEntry({id: part[0].toLowerCase().replace(/\s/g,''), label: part[0], value: part[1]});
			}
		}
		
		var stat = { "pass": 0, "fail": 0, "na": 0, "unverified": 0 };
		
		var showAA = document.getElementById('show-aa').checked;
		var showAAA = document.getElementById('show-aaa').checked;
		
		var reportTable = '';
		
		reportTable += '<details id="conformance">\n<summary>Detailed Conformance Results</summary>\n<table>\n<thead>\n<tr><th>Success Criteria</th>\n<th>Level</th>\n<th>Result</th>\n</thead>\n<tbody>\n';
		
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
			
			reportTable += '<tr>\n<th>' + (criteria[i].getElementsByClassName('label'))[0].textContent + '</th>\n';
			
			reportTable += '<td class="lvl">' + conf_level.toUpperCase() + '</td>\n';
			
			reportTable += '<td class="' + status + '"><p class="label">';
			
			if (status == 'pass') {
				reportTable += 'Pass</p>'
				if (log) {
					stat.pass += 1;
				}
			}
			
			else if (status == 'fail') {
				var err = document.getElementById(criteria[i].id+'-err').value;
				reportTable += 'Fail</p>'
				
				// add the reason 
				if ((err != '') && (_notesToDisplay == 'failures' || _notesToDisplay == 'notes')) {
					reportTable += '<p>' + err.replace(/</g,'&lt;').replace(/\r?\n/g, '</p><p>') + '</p>';
				}
				
				if ((criteria['name'] != 'EPUB') || ((criteria['name'] == 'EPUB') && (criteria[i].id != 'eg-2'))) {
					if (log) {
						stat.fail += 1;
					}
				}
			}
			
			else if (status == 'na') {
				reportTable += 'Not Applicable</p>';
				if (log) {
					stat.na += 1;
				}
			}
			
			else {
				reportTable += 'Not checked</p>';
				if (log) {
					stat.unverified += 1;
				}
			}
			
			if (_notesToDisplay == 'failures' || _notesToDisplay == 'none') {
				if ((document.getElementsByName(criteria[i].id+'-note'))[0].checked) {
					reportTable += '\n<p class="label">Additional info:</p><p class="value">' + document.getElementById(criteria[i].id+'-info').value + '</p>\n';
				}
			}
			
			reportTable += '</td>\n</tr>\n';
		}
		
		reportTable += '</tbody>\n</table>';
		reportTable += '</details>\n';
		
		/* add conformance */
		
		var stats = (stat.fail ? stat.fail + ' fail, ' : '') + (stat.unverified ? stat.unverified + ' unverified, ' : '') + stat.pass + ' pass' + (stat.na ? ', ' + stat.na + ' not applicable' : '');
		
		reportDetails += formatPubInfoEntry({id: 'result', label: 'Statistics', value: stats});
		
		reportDetails += '</details>\n';
		reportDetails += reportTable;
		reportDetails += '</section>\n'
		
		/*
		var cssURL = document.getElementById('add-custom-css').checked ? document.getElementById('custom-css-url').value.trim() : '';
		
		var css = document.getElementById('default-styles').checked ? HTML_DEFAULT_STYLES : '';
			css += (cssURL != '') ? '\n<link rel="stylesheet" type="text/css" href="'+cssURL+'"/>\n' : '';
		*/ 
		
		var report_title = 'EPUB Accessibility Conformance Report for ' + title;
		var report_body = reportBody + reportSummary + reportDetails;
		var report_timestamp = smartFormat.generateTimestamp('at');
		
		var logo = '';
		
		if (Object.keys(extension).length > 0) {
			for (var key in extension) {
				logo += (typeof extension[key].LOGO !== 'undefined' && extension[key].LOGO) ? '<a href="' + extension[key].LOGO[2] + '"><img src="' + extension[key].LOGO[0] + '" alt="' + extension[key].LOGO[1] + '"/>' : '';
			}
		}
		
		if (_reportOutputLocation == 'win') {
			var reportWin = window.open('report.html','reportWin');
				reportWin.addEventListener('load', function() { reportWin.init(report_title, logo, report_body, report_timestamp); });
		}
		
		else {
			var report_template = '';
			var xhr = new XMLHttpRequest();
			
			xhr.open("GET", 'report.html', true);
			
			xhr.onreadystatechange = function() {
				if (xhr.readyState == 4){
			    	report_template = xhr.responseText;
			    	report_template = report_template.replace('<title></title>', '<title>' + report_title + '</title>');
			    	//report_template = report_template.replace('<div id="add-id"></div>', '<div id="add-id">' + logo + '</div>');
			    	report_template = report_template.replace('<main></main>', '<main>' + report_body + '</main>');
			    	report_template = report_template.replace('<span id="date-created"></span>', '<span id="date-created">' + report_timestamp + '</span>');
			    	report_template = report_template.replace(/<script type="text\/javascript">[\s\S]+?<\/script>\s*/i, '');
			    	document.getElementById('report-html').value = report_template;
			    }
			}
			
			xhr.send();
		}
	}
	
	
	
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
		options.value_bg_class = options.value_bg ?  ' ' + options.value_bg : '';
		
		return (options.value == '') ? '' : '<p id="' + options.id + '"><span class="label">' + options.label + ':</span> <span class="value' + options.value_bg_class + '"' + ((options.property == '') ? '' : ' property="' + options.property + '"') + '>' + options.value + '</span></p>\n';
	}
	
	
	function formatTitleSubInfo(id,value,prop) {
		return '<span id="' + id + '" property="' + prop + '">' + value + '</span> | ';
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
