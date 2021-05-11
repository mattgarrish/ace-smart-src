
'use strict';

/* 
 * 
 * smartConformance
 * 
 * Controls the display and validation of success criteria
 * 
 * Public functions:
 * 
 * - setEvaluationResult - sets the result based on the epub/wcag versions conformed to 
 * 
 * - addSuccessCriteriaReporting - dynamically adds the status and note fields to success criteria
 * 
 * - setWCAGVersion - changes the success criteria to match the selected version of the standard
 * 
 * - setWCAGConformanceLevel - updates the displayed conformance tests to the user-selected level
 * 
 * - displaySuccessCriteria - show/hide success criteria for the specified wcag level (used to show both current level and optional criteria)
 * 
 * - configureContentTypeTests - show/hide success criteria based on the type of content in the publications (audio/video/etc.)
 * 
 * - setGlobalSCStatus - allows all success criteria to be set to the specified status
 * 
 * - setSCStatus - called whenever a success criterion's status field is changed (sets background, conformance result, etc.)
 * 
 * - showSCNoteField - shows the success criterion's note input field when the user clicks the options to add
 * 
 * - filterSCByStatus - allows users to filter out success criteria by their current status
 * 
 * - showSCBody - toggles the visibility of a success criterion's body (explanation and help links)
 * 
 * - showSCHelpLinks - toggles open/closed the kb and wcag links within each success criterion
 * 
 */

var smartConformance = (function() {

	var _SC_TYPE = new Object();
		_SC_TYPE.img = ['sc-1.4.9'];
		_SC_TYPE.audio = ['sc-1.4.2', 'sc-1.4.7'];
		_SC_TYPE.video = ['sc-1.2.2', 'sc-1.2.3', 'sc-1.2.5', 'sc-1.2.6', 'sc-1.2.7', 'sc-1.2.8'];
		_SC_TYPE.av = ['sc-1.2.1', 'sc-1.2.4', 'sc-1.2.9'];
		_SC_TYPE.script = ['sc-2.2.1', 'sc-2.2.4', 'sc-2.2.5', 'sc-3.2.1', 'sc-3.2.2', 'sc-3.2.4', 'sc-3.2.5', 'sc-3.3.1', 'sc-3.3.2', 'sc-3.3.3', 'sc-3.3.4', 'sc-3.3.5', 'sc-3.3.6'];

	var _STATUS = new Object();
		_STATUS.incomplete = smart_ui.conformance.status.incomplete[smart_lang];
		_STATUS.fail = smart_ui.conformance.status.fail[smart_lang];
		_STATUS.pass = smart_ui.conformance.status.pass[smart_lang];
		_STATUS.epub10 = smart_ui.conformance.status.epub10[smart_lang];
		_STATUS.epub11 = smart_ui.conformance.status.epub11[smart_lang];
		_STATUS.wcag20 = smart_ui.conformance.status.wcag20[smart_lang];
		_STATUS.wcag21 = smart_ui.conformance.status.wcag21[smart_lang];
		_STATUS.a = smart_ui.conformance.status.a[smart_lang];
		_STATUS.aa = smart_ui.conformance.status.aa[smart_lang];
		
	var _WCAG_VER = ['2.0', '2.1'];
	
	/* changes the form to match the epub accessibility version options */
	
	function setEPUBA11yVersion(version) {
	
		var wcag_ver = document.getElementById('wcag-version');
		
		if (version == "1.1") {
			wcag_ver.disabled = false;
		}
		
		else if (version == "1.0") {
			wcag_ver.value = "2.0";
			wcag_ver.disabled = true;
		}
		
		else {
			// unhandled version
			console.log("Unhanled EPUB Accessibility version " + version);
		}

	}
	
	/* changes the visible success criteria based on the user setting */
	
	function setWCAGVersion(version) {
		smartWCAG.setWCAGVersion(version);
		setWCAGConformanceLevel(smartWCAG.WCAGLevel());
	}
	
	/* changes the visible success criteria based on the user setting */
	
	function setWCAGConformanceLevel(level) {
	
		smartWCAG.setWCAGLevel(level);
		
		if (!document.getElementById('show-aa').checked) {
			displaySuccessCriteria({wcag_level: 'aa', display: (level == 'aa' ? true : false)});
		}
		
		// show notes for success criteria that are superseded by a higher-level requirement
		
		var sup = document.getElementsByClassName('superseded-aa');
		
		for (var i = 0; i < sup.length; i++) {
			if (level == 'aa') {
				sup[i].classList.remove('hidden');
			}
			else {
				sup[i].classList.add('hidden');
			}
		}
		
		smartWCAG.setWCAGClassList();
		
		document.getElementById('show-aa').disabled = (level == 'aa') ? true : false;
	}
	
	
	/* makes success criteria visible/hidden based on their class */
	
	function displaySuccessCriteria(options) {
		var success_criteria = document.getElementsByClassName(options.wcag_level);
		
		var hide = false;
		
		for (var i = 0; i < _WCAG_VER.length; i++) {
		
			var success_criteria = document.getElementsByClassName('w' + _WCAG_VER[i].replace('.',''));
		
			for (var j = 0; j < success_criteria.length; j++) {
				if (hide) {
					success_criteria[j].classList.remove('visible');
					success_criteria[j].classList.add('hidden');
				}
				else {
					success_criteria[j].classList.remove('hidden');
					success_criteria[j].classList.add('visible');
				}
			}
			
			if (_WCAG_VER[i] == smartWCAG.WCAGVersion()) {
				hide = true;
			}
		}
		
		smartWCAG.setWCAGClassList();
	}
	
	
	/* 
	 * Dynamically generates the status radio buttons and note fields for 
	 * evaluating the success criteria
	 */
	
	function addSuccessCriteria() {
	
		var sc_nodes = new Array();
		
		for (var i = 0; i < sc_config['sc'].length; i++) {
		
			var id = sc_config['sc'][i].hasOwnProperty('id') ? sc_config['sc'][i].id : '';
			var level = sc_config['sc'][i].hasOwnProperty('level') ? sc_config['sc'][i].level : '';
			var version = sc_config['sc'][i].hasOwnProperty('version') ? sc_config['sc'][i].version : '2.0'
			
			var wcag_number = 0;
			var match_wcag_number = id.match(/([1-4]\.[1-9]\.[0-9]+)/);
			
			if (match_wcag_number) {
				wcag_number = match_wcag_number[0];
			}
			
			/* create section for new success criterion */
			
			sc_nodes.push('<section id="' + id + '" class="w' + version.replace('.','') + ' ' + level + '">');
			sc_nodes.push('<h3>');
			sc_nodes.push('<span class="label">');
			
			if (wcag_number) {
				sc_nodes.push(wcag_number + ' ');
			}
			
			if (sc_config['sc'][i].hasOwnProperty('name') && sc_config['sc'][i].name.hasOwnProperty(smart_lang)) {
				sc_nodes.push(sc_config['sc'][i].name[smart_lang]);
			}
			
			sc_nodes.push('</span>');
			
			sc_nodes.push('<span class="' + (wcag_number ? level : 'epub') + '-label">');
			sc_nodes.push((wcag_number ? smart_ui.conformance.level[smart_lang] + ' ' + level.toUpperCase() : 'EPUB'));
			sc_nodes.push('</span>');
			sc_nodes.push('</h3>');
			
			/* create body div for guidance and links */
			
			sc_nodes.push('<div class="sc-body">');
			
			/* add guidance - imports html embedded in json */
			
			if (sc_config['sc'][i].hasOwnProperty('guidance') && sc_config['sc'][i].guidance.hasOwnProperty(smart_lang)) {
				sc_nodes.push(sc_config['sc'][i].guidance[smart_lang]);
				sc_nodes.push('<hr>');
			}
			
			// checks whether to add another hr separator
			var has_links = false;
			
			/* add kb links */
			
			if (sc_config['sc'][i].hasOwnProperty('kb') && sc_config['sc'][i].kb.hasOwnProperty(smart_lang) && Object.keys(sc_config['sc'][i].kb[smart_lang]).length > 0) {
				sc_nodes.push(createSCLinkDetails('kb',sc_config['sc'][i].kb[smart_lang],''));
				has_links = true;
			}
			
			/* add documentation links */
			
			if (sc_config['sc'][i].hasOwnProperty('ref')) {
				sc_nodes.push(createSCLinkDetails('doc', sc_config['sc'][i].ref, wcag_number));
				has_links = true;
			}
			
			if (has_links) {
				sc_nodes.push('<hr>');
			}
			
			/* close sc-body div */
			
			sc_nodes.push('</div>');
			
			/* add wrapper div with reporting class for hiding later */
			
			sc_nodes.push('<div class="reporting">');
			
			/*  add the status radio buttons */
			sc_nodes.push('<fieldset id="' + id + '-legend"' + 'class="flat status">');
			
			sc_nodes.push('<legend>');
				sc_nodes.push(smart_ui.conformance.labels.status[smart_lang]);
			sc_nodes.push('</legend>');
			
			for (var stat in smart_ui.conformance.result) {
				sc_nodes.push('<label>');
				sc_nodes.push('<input id="' + id + '-' + stat + '" type="radio" name="' + id + '" value="' + stat + '" class="sc_status" aria-labelledby="' + id + '-legend"');
				
				if (stat == 'unverified') {
					sc_nodes.push(' checked="checked"');
				}
				
				sc_nodes.push('>');
				
				sc_nodes.push(' ' + smart_ui.conformance.result[stat][smart_lang]);
				sc_nodes.push('</label>');
				sc_nodes.push(' ');
			}
			
			/* add the failure textarea */
			
			sc_nodes.push('<div id="' + id + '-failnote" class="failure">');
			sc_nodes.push('<p>');
			sc_nodes.push('<label for="' + id + '-err">');
				sc_nodes.push(smart_ui.conformance.labels.failure[smart_lang]);
			sc_nodes.push('</label>');
			sc_nodes.push('</p>');
			
			sc_nodes.push('<textarea id="' + id + '-err" rows="5" cols="80"></textarea>');
			sc_nodes.push('</div>');
			
			/* close the radio button fieldset */
			sc_nodes.push('</fieldset>');
			
			/* add the note checkbox and textarea */
			
			sc_nodes.push('<p>');
			sc_nodes.push('<label>');
			sc_nodes.push('<input type="checkbox" id="' + id + '-notebox" name="' + id + '-notebox" class="show-note">');
			sc_nodes.push(' ' + smart_ui.conformance.labels.note[smart_lang]);
			sc_nodes.push('</label>');
			sc_nodes.push('</p>');
			
			sc_nodes.push('<div id="' + id + '-note" class="info">');
			sc_nodes.push('<textarea id="' + id + '-info" rows="5" cols="80" aria-label="' + smart_ui.conformance.note[smart_lang] + '"></textarea>');
			sc_nodes.push('</div>');
			
			sc_nodes.push('</div>');
			sc_nodes.push('</section>');
		}
		
		/* append all success criteria at once to avoid bottleneck */
		document.getElementById('sc-list').innerHTML = sc_nodes.join('');
	}
	
	/*  */
	function createSCLinkDetails(type, json, id) {
		var details = '<details><summary>';
			details += (type == 'kb') ? smart_ui.conformance.labels.kb[smart_lang] : smart_ui.conformance.labels.wcag[smart_lang];
		details += '</summary>';
		
		details += '<ul>';
		
		if (type == 'doc') {
			details += '<li><a href="https://www.w3.org/WAI/WCAG21/Understanding/' + json + '.html" target="_blank">Understanding Success Criterion ' + id + '</a></li>';
			details += '<li><a href="https://www.w3.org/WAI/WCAG21/quickref/#' + json + '" target="_blank">How to meet Success Criterion' + id + '</a></li>';
		}
		
		else {
			for (var link in json) {
				details += '<li><a href="' + json[link] + '" target="_blank">' + link + '</a></li>';
			}
		}
		
		details += '</ul></details>';
		return details;
	}
	
	
	
	/* shows/hides sets of content-specific tests */
	function configureContentTypeTests(options) {
	
		// select all content-specific tests
		// applicable tests are identified by a data-scope attribute - e.g. data-scope="audio"
		var checks = document.querySelectorAll('*[data-scope="' + options.type + '"]');
		
		for (var i = 0; i < checks.length; i++) {
			if (options.exclude) {
				checks[i].classList.add('hidden');
			}
			else {
				checks[i].classList.remove('hidden');
			}
		}
		
		//  check set audio+video SC
		if (options.type=='audio' || options.type=='video') {
			var av = (document.querySelector('#exclusions input[value="audio"]').checked || document.querySelector('#exclusions input[value="video"]').checked) ? false : true;
			for (var i = 0; i < _SC_TYPE.av.length; i++) {
				// don't flip the status unless av is true or the status is currently 'na' (avoids overriding legit status when loading a saved evaluation)
				var sc_status = document.querySelector('input[name="' + _SC_TYPE.av[i] + '"]:checked').value;
				if (av || sc_status == 'unverified') {
					document.querySelector('input[name="' + _SC_TYPE.av[i] + '"][value="' + (av ? 'unverified' : 'na') + '"]').click();
				}
			}
		}
		
		// hide/show all individual SC for the checked content type
		for (var i = 0; i < _SC_TYPE[options.type].length; i++) {
			var status = options.exclude ? 'na' : 'unverified';
			document.getElementById(_SC_TYPE[options.type][i] + '-' + status).checked = true;
			setSuccessCriteriaStatus({name: _SC_TYPE[options.type][i], value: status});
		}
	}
	
	
	/* sets the appropriate status for the publication based on the how the success criteria have been evaluated */
	function setEvaluationResult() {
	
		var show_aa = smartWCAG.WCAGClassList().indexOf('|aa|') > 0 ? true  : false;
		
		var status_label = document.getElementById('conformance-result-status');
		var status_input = document.getElementById('conformance-result');
		
		var wcag_version = smartWCAG.WCAGVersion();
		var epub_a11y = document.getElementById('epub-a11y').value;
		
		var wcag_class = 'w' + wcag_version.replace('.','');
		
		// make sure there aren't any unverified success criteria
		var unverified = 'section.a.' + wcag_class + ' input[value="unverified"]:checked, section#eg-2 input[value="unverified"]:checked, section#eg-1 input[value="unverified"]:checked';
			unverified += smartWCAG.WCAGLevel() == 'aa' ? ', section.aa.' + wcag_class + ' input[value="unverified"]:checked' : '';
		
		var incomplete = document.querySelectorAll(unverified);
		
		if (incomplete.length > 0) {
			status_label.textContent = _STATUS.incomplete;
			status_input.value = 'incomplete';
			return;
		}
		
		var onix_a = document.getElementById('onix02');
		var onix_aa = document.getElementById('onix03');
		
		var level_a_fail = document.querySelectorAll('section.a.' + wcag_class + ' input[value="fail"]:checked, section#eg-2 input[value="fail"]:checked');
		
		// prep pass message
		var conformance_status = _STATUS.pass + ' - ';
			conformance_status += epub_a11y == 1.0 ? _STATUS.epub10 : _STATUS.epub11;
			conformance_status += ' + ';
			conformance_status += wcag_version == 2.0 ? _STATUS.wcag20 : _STATUS.wcag21;
			conformance_status += ' ';
	
		// checks that there aren't any failures if AA is specified
		// or if showing optional AA success criteria and all have been checked
		if (smartWCAG.WCAGLevel() == 'aa' || (show_aa && document.querySelectorAll('section.aa.' + wcag_class + ' input[value="unverified"]:checked').length == 0)) {
			
			if (level_a_fail.length == 0 && document.querySelectorAll('section.aa.' + wcag_class + ' input[value="fail"]:checked').length == 0) {
				
				status_label.textContent = conformance_status + _STATUS.aa;
				
				status_input.value = 'aa';
				
				if (!onix_aa.checked) { onix_aa.click(); }
				if (onix_a.checked) { onix_a.click(); }
				return;
			}
		}
		
		// otherwise not having an else if here allows verification to fall through to A, even if testing AA
		if (level_a_fail.length == 0) {
			
			status_label.textContent = conformance_status + _STATUS.a;
			
			status_input.value = 'a';
			
			if (onix_aa.checked) { onix_aa.click(); }
			if (!onix_a.checked) { onix_a.click(); }
		}
		
		else {
			status_label.textContent = _STATUS.fail;
			status_input.value = 'fail';
			if (onix_aa.checked) { onix_aa.click(); }
			if (onix_a.checked) { onix_a.click(); }
		}
	}
	
	
	function setSuccessCriteriaStatus(options) {
		var sc_parent_section = document.getElementById(options.name); 
		
		/* reset the background */
		sc_parent_section.classList.remove(smartFormat.BG.PASS,smartFormat.BG.FAIL,smartFormat.BG.NA);
		
		/* set background to new status */
		if (options.value != 'unverified') {
			sc_parent_section.classList.add(smartFormat.BG[options.value.toUpperCase()]);
		}
		
		/* show/hide the failure message field */
		var failure_message = document.getElementById(options.name + '-failnote');
		
		if (options.value == 'fail') {
			failure_message.classList.add('visible');
		}
		else {
			failure_message.classList.remove('visible');
		}
		
		setEvaluationResult();
	}
		
	
	return {
		setEvaluationResult: function() {
			setEvaluationResult();
		},
		
		setEPUBA11yVersion: function(version) {
			setEPUBA11yVersion(version);
		},
		
		setWCAGVersion: function(version) {
			setWCAGVersion(version);
		},
		
		setWCAGConformanceLevel: function(level) {
			setWCAGConformanceLevel(level);
		},
		
		addSuccessCriteriaReporting: function() {
			addSuccessCriteria();
		},
		
		displaySuccessCriteria: function(options) {
			options = typeof(options) === 'object' ? options : {};
			options.wcag_level = options.wcag_level ? options.wcag_level : 'aa';
			options.display = options.hasOwnProperty('display') ? options.display : true;
			displaySuccessCriteria(options);
		},
		
		configureContentTypeTests: function(options) {
			options = typeof(options) === 'object' ? options : {};
			if (!options.hasOwnProperty('type')) {
				return;
			}
			options.exclude = options.hasOwnProperty('exclude') ? options.exclude : false; 
			configureContentTypeTests(options);
		},
		
		setGlobalSCStatus: function(status) {
			if (!confirm(smart_ui.conformance.changeSC[smart_lang])) {
				return;
			}
			
			var success_criteria = document.querySelectorAll('.a, .aa, .aaa, .epub');
			
			for (var i = 0; i < success_criteria.length; i++) {
				if (!success_criteria[i].classList.contains('hidden')) {
					document.querySelector('input[name="' + success_criteria[i].id + '"][value="' + status + '"]').click();
				}
			}
		},
		
		setSCStatus: function(options) {
			if (typeof(options) !== 'object' || !options.hasOwnProperty('name')) {
				return;
			}
			setSuccessCriteriaStatus(options);
		},
		
		showSCNoteField: function(sc_status_radio) {
		    var note = document.getElementById(sc_status_radio.name.replace('box',''));
		    
		    if (sc_status_radio.checked) {
				note.classList.add('visible');
		    }
		    else {
			    note.classList.remove('visible');
		    }
		},
		
		filterSCByStatus: function(radio) {
			var status_inputs = document.querySelectorAll('input.sc_status[value="' + radio.value + '"]:checked');
			for (var i = 0; i < status_inputs.length; i++) {
				var id = status_inputs[i].name;
				var status_parent_section = document.getElementById(id);
				if (radio.checked) {
					status_parent_section.classList.add('hidden');
				}
				else {
					if (smartWCAG.WCAGClassList().indexOf('|'+status_parent_section.className+'|') !== -1) {
						status_parent_section.classList.remove('hidden');
					}
				}
			}
		},
		
		showSCBody: function(display) {
			var success_criteria = document.querySelectorAll('.sc-body');
			for (var i = 0; i < success_criteria.length; i++) {
				if (display) {
					success_criteria[i].classList.remove('hidden');
				}
				else {
					success_criteria[i].classList.add('hidden');
				}
			}
		},
		
		showSCHelpLinks: function(display) {
			var details = document.getElementById('conformance').querySelectorAll('section.a details, section.aa details, section.aaa details, section.epub details');
			for (var i = 0; i < details.length; i++) {
				details[i].open = display;
			}
		}
	}

})();
