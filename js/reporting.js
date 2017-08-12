
var report = new Report();

function Report() {
}



Report.prototype.validateConformanceReport = function() {
	
	var err = false;
	
	error.clearAll();
	
	
	/* validate the title in the config */
	var title_elem = document.getElementById('title');
	
	if (title_elem.value.trim() == '') {
		title_elem.setAttribute('aria-invalid',true);
		title_elem.parentNode.classList.add(format.BG.ERR);
		error.write('start','title','err','Title is a required field.');
		err = true;
	}
	
	else {
		title_elem.setAttribute('aria-invalid',false);
		title_elem.parentNode.classList.remove(format.BG.ERR);
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

	/* validate that the stated conformance matches the evaluation results */
	var failed = document.querySelectorAll('input[value="unverified"]:checked, section.a input[value="fail"]:checked, section.aa input[value="fail"]:checked, section#eg-2 input[value="fail"]:checked').length > 0 ? true : false;
	var wcag_result = document.querySelector('input[name="conf-result"]:checked').value;
	var conf_elem = document.getElementById('conf-result');
	
	if ((wcag_result != 'fail') && failed) {
		conf_elem.classList.add(format.BG.ERR);
		error.write('conformance','conf-result','err','Conformance to the EPUB specification claimed, but report contains unverified success criteria and/or failures.');
		err = true;
	}
	
	else {
		/* also check that the form-configured wcag level matches the stated conformance */
		if (conf.wcag_level != wcag_result) {
			if (conf.wcag_level == 'a') {
				conf_elem.classList.add(format.BG.ERR);
				error.write('conformance','conf-result','err','Tool is configured for testing Level A but Level AA conformance has been claimed.');
			}
			else {
				conf_elem.classList.add(format.BG.WARN);
				error.write('conformance','conf-result','warn','Tool is configured for testing Level AA but Level A conformance has been claimed.');
			}
			err = true;
		}
		else {
			conf_elem.classList.remove(format.BG.ERR);
		}
	}
	
	if (!conf_meta.validate(true)) {
		err = true;
	}
	
	if (!disc.validate(true)) {
		err = true;
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
	
	for (var key in info) {
		var value = document.getElementById(key).value.trim();
		if (value != '') {
			reportBody += format.pubSpan(key,value,info[key]);
		}
	}
	
	reportBody = reportBody.replace(/ \| $/,'');
	
	reportBody += '</div>\n';
	
	var reportSummary = '<section id="summary">\n'
		reportSummary += '<div class="summaryTable">\n';
		reportSummary += '<h3><span>Report Summary</span><span></span></h3>';
		
	var wcag_conf = document.querySelector('input[name="conf-result"]:checked').value;
	
	var wcag_label = [];
		wcag_label.a = 'EPUB + WCAG 2.0 Level A';
		wcag_label.aa = 'EPUB + WCAG 2.0 Level AA';
		wcag_label.fail = 'Failed';
		
	var conf_class = [];
		conf_class.a = 'pass';
		conf_class.aa = 'pass';
		conf_class.fail = 'fail';
	
	reportSummary += format.pubInfo('conformance','Conformance',wcag_label[wcag_conf],'dcterms:conformsTo',conf_class[wcag_conf]);

	reportSummary += format.pubInfo('summary','Description',document.getElementById('accessibilitySummary').value,'accessibilitySummary','');
	reportSummary += format.pubInfo('features','Features',this.listDiscoveryMeta('accessibilityFeature','accessibilityFeature'),'');
	reportSummary += format.pubInfo('hazards','Hazards',this.listDiscoveryMeta('accessibilityHazard','accessibilityHazard'),'');
	reportSummary += format.pubInfo('modes','Access Mode(s)',this.listDiscoveryMeta('accessMode','accessMode'),'');
	
	
	var certifier = document.getElementById('certifier').value.trim();
	
	if (certifier != '') {
		reportSummary += format.pubInfo('certifier','Certifier',certifier,'');
	}
	
	// reportSummary += '<p id="credential"><span class="label">Credential:</span> <span class="value"><a href="http://www.daisy.org/ace/certified">DAISY Ace Certified</a>';
	
	var credNum = document.querySelectorAll('fieldset.credential').length;
	
	var cred = '';
	
	for (var i = 1; i <= credNum; i++) {
		var name = document.getElementById('credentialName'+i).value.trim();
		var link = document.getElementById('credentialLink'+i).value.trim();
		
		if (name != '' && link != '') {
			cred += '<br><a href="' + link + '">' + name + '</a>';
		}
		
		else if (name != '') {
			cred += '<br>' + name;
		}
		
		else if (link != '') {
			cred += '<br><a href="' + link + '">' + link + '</a>';
		}
	}
	
	if (cred != '') {
		reportSummary += format.pubInfo('credential','Additional Credential(s)',cred,'');
	}
	
	reportSummary += '\n</div>\n</section>\n';

	var reportDetails = '<section id="details">\n<h3>Additional Information</h3>\n';
		reportDetails += '<details class="info">\n<summary>Publication Information</summary>\n';
	
	reportDetails += format.pubInfo('format','Format', 'EPUB ' + document.querySelector('input[name="epub-format"]:checked').value,'');
	
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
	
		reportTable += '<details id="' + cat + '">\n<summary>' + cat.toUpperCase() + ' Conformance Details</summary>\n<table>\n<thead>\n<tr><th>Success Criteria</th>\n';
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
			
			reportTable += '<td class="' + status + '"><span class="label">';
			
			if (status == 'pass') {
				reportTable += 'Pass</span>'
				if (log) {
					stat.pass += 1;
				}
			}
			
			else if (status == 'fail') {
				var err = document.getElementById(criteria[cat][i].id+'-err').value;
				reportTable += 'Fail:</span> ' + ((err == '') ? 'No reason provided.' : err);
				if ((criteria[cat]['name'] != 'EPUB') || ((criteria[cat]['name'] == 'EPUB') && (criteria[cat][i].id != 'eg-2'))) {
					if (log) {
						stat.fail += 1;
					}
				}
			}
			
			else if (status == 'na') {
				reportTable += 'Not Applicable</span>';
				if (log) {
					stat.na += 1;
				}
			}
			
			else {
				reportTable += 'Not checked</span>';
				if (log) {
					stat.unverified += 1;
				}
			}
			
			if ((document.getElementsByName(criteria[cat][i].id+'-note'))[0].checked) {
				reportTable += '\n<p><span class="label">Additional info:</span> <span class="value">' + document.getElementById(criteria[cat][i].id+'-info').value + '</span></p>\n';
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
	
	var reportWin = window.open('report.html','reportWin');
		reportWin.addEventListener('load', function() { reportWin.init('EPUB Accessibility Conformance Report for ' + title, reportBody + reportSummary + reportDetails, format.generateTimestamp('at')); });
}



Report.prototype.addReporting = function() {

	var sc = document.querySelectorAll('.a, .aa, .aaa, .epub');
	
	for (var i = 0; i < sc.length; i++) {
	
		/* add wrapper div with reporting class for hiding later */
		var report = document.createElement('div');
			report.setAttribute('class','reporting');
		
		/*  add the status radio buttons */
		var status = document.createElement('fieldset');
			status.setAttribute('class','status');
		
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
			
			var status_span = document.createElement('span');
				status_span.appendChild(status_input);
				status_span.appendChild(document.createTextNode(' ' + stats[stat]));
			
			status_label.appendChild(status_span);
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
	
	return (str == '' ? 'Not specified' : str);
}



Report.prototype.openConfig = function() {
	document.getElementById('label_config').click();
}
