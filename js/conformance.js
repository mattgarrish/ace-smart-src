
'use strict';

/* 
 * 
 * smartConformance
 * 
 * Controls the display and validation of success criteria
 * 
 * Public variables:
 * 
 * - STATUS - conformance status messages
 * 
 * Public functions:
 * 
 * - addSuccessCriteriaReporting - dynamically adds the status and note fields to success criteria
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
		_SC_TYPE.script = ['sc-2.2.1', 'sc-2.2.4', 'sc-2.2.5', 'sc-2.4.3', 'sc-3.2.1', 'sc-3.2.2', 'sc-3.2.4', 'sc-3.2.5', 'sc-3.3.1', 'sc-3.3.2', 'sc-3.3.3', 'sc-3.3.4', 'sc-3.3.5', 'sc-3.3.6'];

	var _STATUS = new Object();
		_STATUS.incomplete = 'Incomplete';
		_STATUS.fail = 'Failed';
		_STATUS.a = 'Pass - EPUB + WCAG Level A';
		_STATUS.aa = 'Pass - EPUB + WCAG Level AA';
	
	
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
		
		for (var i = 0; i < success_criteria.length; i++) {
			if (options.display) {
				success_criteria[i].classList.remove('hidden');
				success_criteria[i].classList.add('visible');
			}
			else {
				success_criteria[i].classList.remove('visible');
				success_criteria[i].classList.add('hidden');
			}
		};
		
		smartWCAG.setWCAGClassList();
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
				status.setAttribute('id',sc[i].id+'-legend');
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
					status_input.setAttribute('aria-labelledby',sc[i].id+'-legend');
				
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
			document.querySelector('input[name="' + _SC_TYPE[options.type][i] + '"][value="' + (options.exclude ? 'na' : 'unverified') + '"]').click();
		}
	}
	
	
	/* sets the appropriate status for the publication based on the how the success criteria have been evaluated */
	function setEvaluationResult() {
	
		var show_aa = smartWCAG.WCAGClassList().indexOf('|aa|') > 0 ? true  : false;
		
		var status_label = document.getElementById('conformance-result-status');
		var status_input = document.getElementById('conformance-result');
		
		// make sure there aren't any unverified success criteria
		var unverified = 'section.a input[value="unverified"]:checked, section#eg-2 input[value="unverified"]:checked, section#eg-1 input[value="unverified"]:checked';
			unverified += smartWCAG.WCAGLevel() == 'aa' ? ', section.aa input[value="unverified"]:checked' : '';
		
		var incomplete = document.querySelectorAll(unverified);
		
		if (incomplete.length > 0) {
			status_label.textContent = _STATUS.incomplete;
			return;
		}
		
		var onix_a = document.getElementById('onix02');
		var onix_aa = document.getElementById('onix03');
		
		var level_a_fail = document.querySelectorAll('section.a input[value="fail"]:checked, section#eg-2 input[value="fail"]:checked');
		
		// checks that there aren't any failures if AA is specified
		// or if showing optional AA success criteria and all have been checked 
		if (smartWCAG.WCAGLevel() == 'aa' || (show_aa && document.querySelectorAll('section.aa input[value="unverified"]:checked').length == 0)) {
			
			if (level_a_fail.length == 0 && document.querySelectorAll('section.aa input[value="fail"]:checked').length == 0) {
				status_label.textContent = _STATUS.aa;
				status_input.value = 'aa';
				if (!onix_aa.checked) { onix_aa.click(); }
				if (onix_a.checked) { onix_a.click(); }
				return;
			}
		}
		
		// otherwise not having an else if here allows verification to fall through to A, even if testing AA
		if (level_a_fail.length == 0) {
			status_label.textContent = _STATUS.a;
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
	
	
	return {
		STATUS: _STATUS,
		
		setWCAGConformanceLevel: function(level) {
			setWCAGConformanceLevel(level);
		},
		
		addSuccessCriteriaReporting: function() {
			addSCStatusFields();
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
			if (!confirm('This action will change all current status fields and cannot be undone.\n\nPlease confirm to continue.')) {
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
			
			var sc_parent_section = document.getElementById(options.name); 
			
			/* reset the background */
			sc_parent_section.classList.remove(smartFormat.BG.PASS,smartFormat.BG.FAIL,smartFormat.BG.NA);
			
			/* set background to new status */
			if (options.value != 'unverified') {
				sc_parent_section.classList.add(smartFormat.BG[options.value.toUpperCase()]);
			}
			
			/* show/hide the failure message field */
			var failure_message = document.getElementById(options.name+'-fail');
			
			if (options.value == 'fail') {
				failure_message.classList.add('visible');
			}
			else {
				failure_message.classList.remove('visible');
			}
			
			setEvaluationResult();
		},
		
		showSCNoteField: function(sc_status_radio) {
		    var note = document.getElementById(sc_status_radio.name);
		    
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
