
var report = new Report();

function Report() {
	this.outputLocation = 'win';
	this.displayNotes = 1; // 1 - show all; 2 - show only failures; 3 - show only general; 0 - hide all
}


Report.prototype.setOutputLocation = function(loc) {
	this.outputLocation = loc;
	
	document.getElementById('report-html').style.display = (loc == 'win') ? 'none' : 'block';
	document.getElementById('popup-instructions').style.display = (loc == 'box') ? 'none' : 'block';
}


Report.prototype.setNoteDisplay = function(code) {
	this.displayNotes = code;
}


Report.prototype.validateConformanceReport = function() {
	
	var err = false;
	
	error.clearAll();
	
	
	/* validate the title/modified date in the config */
	var req_meta = {'title': 'title', 'modified': 'last modified date'};
	
	for (var key in req_meta) {
		var meta_elem = document.getElementById(key);
		
		if (meta_elem.value.trim() == '') {
			meta_elem.setAttribute('aria-invalid',true);
			meta_elem.parentNode.classList.add(format.BG.ERR);
			error.write('start',key,'err','The ' + req_meta[key] + ' is a required field.');
			err = true;
		}
		
		else {
			meta_elem.setAttribute('aria-invalid',false);
			meta_elem.parentNode.classList.remove(format.BG.ERR);
		}
	}
	
	/* validate the optional metadata field */
	
	var optional_elem = document.getElementById('optional-meta');
	var opt_meta_value = optional_elem.value.trim();
	
	if (opt_meta_value != '') {
		var meta = opt_meta_value.replace(/\r\n/g,'\n').split('\n');
		var meta_err = false;
		for (var i = 0; i < meta.length; i++) {
			if (!meta[i].match(/: /)) {
				optional_elem.setAttribute('aria-invalid',true);
				optional_elem.parentNode.classList.add(format.BG.ERR);
				error.write('start','optional-meta','err','Missing a colon separator on line ' + (i+1));
				err = true;
				meta_err = true;
			}
		}
		if (!meta_err) {
			optional_elem.setAttribute('aria-invalid',false);
			optional_elem.parentNode.classList.remove(format.BG.ERR);
		}
	}
	
	else {
		optional_elem.setAttribute('aria-invalid',false);
		optional_elem.parentNode.classList.remove(format.BG.ERR);
	}
	
	/* check there is a custom style sheet url
	if (document.getElementById('add-custom-css').checked) {
		var url_elem = document.getElementById('custom-css-url');
		if (url_elem.value.trim() == '') {
			url_elem.setAttribute('aria-invalid',true);
			url_elem.parentNode.classList.add(format.BG.ERR);
			error.write('config','add-custom-css','err','URL to the custom style sheet is required.');
			err = true;
		}
		
		else {
			url_elem.setAttribute('aria-invalid',false);
			url_elem.parentNode.classList.remove(format.BG.ERR);
		}
	}
	*/

	var unver = 'section.a input[value="unverified"]:checked';
		unver += conf.wcag_level == 'a' ? '' : ', section.aa input[value="unverified"]:checked';
	
	var unverified = document.querySelectorAll(unver);
	
	if (unverified) {
		for (var i = 0; i < unverified.length; i++) {
			error.write('verification',unverified[i].name,'err','Success criteria ' + unverified[i].name.replace('sc-','') + ' is unverified.');
		}
	}
	
	err = conf_meta.validate(true) ? err : true;
	
	err = disc.validate(true) ? err : true;
	
	// validate user extensions
	if (Object.keys(extension).length > 0) {
		for (var key in extension) {
			err = extension[key].validate() ? err : true;
		}
	}
	
	if (err) {
		if (!confirm('Report did not validate successfully!\n\nClick Ok to generate anyway, or Cancel to exit.')) {
			return;
		}
	}
	
	this.generateConformanceReport();
}


Report.prototype.generateConformanceReport = function() {
	
	var criteria = {
		'wcag': document.querySelectorAll('.a, .aa, .aaa'),
		'epub': document.querySelectorAll('.epub')
	}
	
	var title = document.getElementById('title').value;
	
	var reportBody = '<h2 id="title" property="name">' + document.getElementById('title').value.trim() + '</h2>';
	
	/* add publication info */
	
	reportBody += '<div class="pubinfo">';
	
	var info = {'creator': 'author', 'identifier': 'identifier', 'publisher': 'publisher'};
	
	// used to determine whether to add ID to pub info below
	var delayID = false;
	
	for (var key in info) {
		var value = document.getElementById(key).value.trim();
		if (value != '') {
			if (key == 'identifier' && !value.match(/^(ISBN|ISSN|DOI)/i)) {
				if (value.match(/^97[89]/)) {
					value = 'ISBN ' + value;
				}
				else {
					delayID = true;
					continue;
				}
			}
			reportBody += format.pubSpan(key,value,info[key]);
		}
	}
	
	reportBody = reportBody.replace(/ \| $/,'');
	
	reportBody += '</div>\n';
	
	var reportSummary = '<section id="summary">\n'
		reportSummary += '<div class="summaryTable">\n';
		reportSummary += '<h3><span>Synopsis</span><span></span></h3>';
		
	var wcag_conf = document.getElementById('conf-result').value;
	
	var conf_class = [];
		conf_class.incomplete = 'undefined';
		conf_class.a = 'pass';
		conf_class.aa = 'pass';
		conf_class.fail = 'fail';
	
	reportSummary += format.pubInfo('conformance','Conformance',conf.STATUS[wcag_conf],'dcterms:conformsTo',conf_class[wcag_conf]);

	reportSummary += format.pubInfo('accessibilitySummary','Summary',document.getElementById('accessibilitySummary').value,'accessibilitySummary','');
	reportSummary += format.pubInfo('accessibilityFeatures','Features',this.listDiscoveryMeta('accessibilityFeature','accessibilityFeature'),'');
	reportSummary += format.pubInfo('accessibilityHazards','Hazards',this.listDiscoveryMeta('accessibilityHazard','accessibilityHazard'),'');
	reportSummary += format.pubInfo('accessModes','Access Mode(s)',this.listDiscoveryMeta('accessMode','accessMode'),'');
	
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
	
	reportSummary += format.pubInfo('accessibilityAPI', 'Accessibility APIs', this.listDiscoveryMeta('accessibilityAPI','accessibilityAPI'),'');
	reportSummary += format.pubInfo('accessibilityControl', 'Accessibility Control', this.listDiscoveryMeta('accessibilityControl','accessibilityControl'),'');
	
	var certifier = document.getElementById('certifiedBy').value.trim();
	
	if (certifier != '') {
		reportSummary += format.pubInfo('certifiedBy','Evaluated by',certifier,'');
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
		reportSummary += format.pubInfo('credential','Additional Credential(s)',cred,'');
	}
	
	reportSummary += '\n</div>\n</section>\n';

	var reportDetails = '<section id="details" aria-label="Additional Information">\n';
		reportDetails += '<details class="info">\n<summary>Additional Details</summary>\n';
	
	// add epub version
	reportDetails += format.pubInfo('format','Format', 'EPUB ' + document.querySelector('input[name="epub-format"]:checked').value,'');
	
	if (delayID) {
		reportDetails += format.pubInfo('identifier','Identifier', document.getElementById('identifier').value.trim(), '');
	}
	
	reportDetails += format.pubInfo('modified','Last Modified', document.getElementById('modified').value.trim(), '');
	reportDetails += format.pubInfo('date','Published', document.getElementById('date').value.trim(), '');
	reportDetails += format.pubInfo('description','Description', document.getElementById('description').value.trim(), '');
	reportDetails += format.pubInfo('subject','Subject', document.getElementById('subject').value.trim(), '');
	
	var optional_meta = document.getElementById('optional-meta').value.trim();
	
	if (optional_meta != '') {
		var meta = optional_meta.replace(/\r\n/g,'\n').split('\n');
		for (var i = 0; i < meta.length; i++) {
			var part = meta[i].split(': ');
			reportDetails += format.pubInfo(part[0].toLowerCase().replace(/\s/g,''),part[0],part[1],'');
		}
	}
	
	var stat = { "pass": 0, "fail": 0, "na": 0, "unverified": 0 };
	
	var showAA = document.getElementById('show-aa').checked;
	var showAAA = document.getElementById('show-aaa').checked;
	
	var reportTable = '';
	
	for (var cat in criteria) {
	
		reportTable += '<details id="' + cat + '">\n<summary>' + cat.toUpperCase() + ' Conformance Results</summary>\n<table>\n<thead>\n<tr><th>Success Criteria</th>\n';
		reportTable += (cat == 'wcag') ? '<th>Level</th>' : ''; 
		reportTable += '<th>Result</th>\n</thead>\n<tbody>\n';
		
		for (var i = 0; i < criteria[cat].length; i++) {
			
			var conf_level = criteria[cat][i].classList.contains('a') ? 'a' : (criteria[cat][i].classList.contains('aa') ? 'aa' : (criteria[cat][i].classList.contains('aaa') ? 'aaa' : 'epub'));
			
			// whether to include in stats for meeting the user specified wcag level
			var log = (conf_level == 'aaa' || conf.wcag_level == 'a' && conf_level != 'a') ? false : true;
			
			var status = document.querySelector('input[name="'+criteria[cat][i].id+'"]:checked').value;
			
			// skip AA (if A conformance) and AAA (all the time) SCs if not selected to show in config options
			if ((conf_level == 'aa' && conf.wcag_level == 'a' && !showAA) || (conf_level == 'aaa' && !showAAA)) {
				continue;
			}
			
			// skip reporting AA (if A conformance) and AAA (all the time) SCs if they are n/a
			if ((conf_level == 'aaa' || (conf_level == 'aa' && conf.wcag_level == 'a'))
					&& (status == 'unverified')) {
				continue;
			}
			
			reportTable += '<tr>\n<th>' + (criteria[cat][i].getElementsByClassName('label'))[0].textContent + '</th>\n';
			
			if (cat == 'wcag') {
				reportTable += '<td class="lvl">' + conf_level.toUpperCase() + '</td>\n';
			}
			
			reportTable += '<td class="' + status + '"><p class="label">';
			
			if (status == 'pass') {
				reportTable += 'Pass</p>'
				if (log) {
					stat.pass += 1;
				}
			}
			
			else if (status == 'fail') {
				var err = document.getElementById(criteria[cat][i].id+'-err').value;
				reportTable += 'Fail</p>'
				
				// add the reason 
				if ((err != '') && (this.displayNotes == 1 || this.displayNotes == 2)) {
					reportTable += '<p>' + err.replace(/</g,'&lt;').replace(/\r?\n/g, '</p><p>') + '</p>';
				}
				
				if ((criteria[cat]['name'] != 'EPUB') || ((criteria[cat]['name'] == 'EPUB') && (criteria[cat][i].id != 'eg-2'))) {
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
			
			if (this.displayNotes == 1 || this.displayNotes == 3) {
				if ((document.getElementsByName(criteria[cat][i].id+'-note'))[0].checked) {
					reportTable += '\n<p class="label">Additional info:</p><p class="value">' + document.getElementById(criteria[cat][i].id+'-info').value + '</p>\n';
				}
			}
			
			reportTable += '</td>\n</tr>\n';
		}
		
		reportTable += '</tbody>\n</table>';
		reportTable += '</details>\n';
	}
	
	/* add conformance */
	
	var stats = (stat.fail ? stat.fail + ' fail, ' : '') + (stat.unverified ? stat.unverified + ' unverified, ' : '') + stat.pass + ' pass' + (stat.na ? ', ' + stat.na + ' not applicable' : '');
	
	reportDetails += format.pubInfo('result','Statistics',stats,'');
	
	reportDetails += '</details>\n';
	reportDetails += reportTable;
	reportDetails += '</section>\n'
	
	/*
	var cssURL = document.getElementById('add-custom-css').checked ? document.getElementById('custom-css-url').value.trim() : '';
	
	var css = document.getElementById('default-styles').checked ? this.HTML_DEFAULT_STYLES : '';
		css += (cssURL != '') ? '\n<link rel="stylesheet" type="text/css" href="'+cssURL+'"/>\n' : '';
	*/ 
	
	var report_title = 'EPUB Accessibility Conformance Report for ' + title;
	var report_body = reportBody + reportSummary + reportDetails;
	var report_timestamp = format.generateTimestamp('at');
	
	var logo = '';
	
	if (Object.keys(extension).length > 0) {
		for (var key in extension) {
			logo += (typeof extension[key].LOGO !== 'undefined' && extension[key].LOGO) ? '<a href="' + extension[key].LOGO[2] + '"><img src="' + extension[key].LOGO[0] + '" alt="' + extension[key].LOGO[1] + '"/>' : '';
		}
	}
	
	if (this.outputLocation == 'win') {
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



Report.prototype.addReporting = function() {

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
				status_input.setAttribute('onclick','conf.setStatus(this)');
			
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
			note_input.setAttribute('onclick','conf.showNote(this)');
		
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


/* generate the reporting fields when page loads */
window.onload = report.addReporting();


/* return discovery metadata sets as strings */

Report.prototype.listDiscoveryMeta = function(id,prop) {
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



Report.prototype.openConfig = function() {
	document.getElementById('label_config').click();
}
