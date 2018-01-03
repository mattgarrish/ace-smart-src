
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

var smartConformance = (function(smartWCAG,smartFormat) {
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
		
		
	function setWCAGConformanceLevel(level) {
	
		smartWCAG.setWCAGLevel(level);
		
		if (!document.getElementById('show-aa').checked) {
			displaySuccessCriteria({wcag_level: 'aa', display: (level == 'aa' ? true : false)});
		}
		
		// show "supserseded by" notes
		
		var sup = document.getElementsByClassName('superseded-aa');
		
		for (var i = 0; i < sup.length; i++) {
			sup[i].style.display = (level == 'aa') ? 'block' : 'none';
		}
		
		smartWCAG.setWCAGClassList();
		
		document.getElementById('show-aa').disabled = (level == 'aa') ? true : false;
	}
	
	
	function displaySuccessCriteria(options) {
		var success_criteria = document.getElementsByClassName(options.wcag_level);
		
		for (var i = 0; i < success_criteria.length; i++) {
			success_criteria[i].style.display = (options.display ? 'block' : 'none');
		};
		
		smartWCAG.setWCAGClassList();
	}
	
	
	function configureContentTypeTests(options) {
	
		// hide partial sc checks
		var checks = document.querySelectorAll('*[data-scope="' + options.type + '"]');
		
		for (var i = 0; i < checks.length; i++) {
			checks[i].style.display = options.exclude ? 'none' : 'block';
		}
		
		//  check set audio+video SC
		if (options.type=='audio' || options.type=='video') {
			var av = (document.getElementById('audio').checked || document.getElementById('video').checked) ? false : true;
			for (var i = 0; i < _SC_TYPE.av.length; i++) {
				// don't flip the status unless av is true or the status is currently 'na' (avoids overriding legit status when loading a saved report)
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
	
	
	function setEvaluationResult() {
	
		var show_aa = smartWCAG.WCAGClassList.indexOf('|aa|') > 0 ? true  : false;
		
		var status_label = document.getElementById('conf-result-status');
		var status_input = document.getElementById('conf-result');
		
		var unverified = 'section.a input[value="unverified"]:checked, section#eg-2 input[value="unverified"]:checked, section#eg-1 input[value="unverified"]:checked';
			unverified += smartWCAG.WCAGLevel == 'aa' ? ', section.aa input[value="unverified"]:checked' : '';
		
		if (document.querySelectorAll(unverified).length > 0) {
			status_label.textContent = _STATUS.incomplete;
			return;
		}
		
		if (smartWCAG.WCAGLevel == 'aa' || show_aa) {
			
			if (document.querySelectorAll('section.a input[value="fail"]:checked, section.aa input[value="fail"]:checked, section#eg-2 input[value="fail"]:checked').length == 0) {
				
				if (smartWCAG.WCAGLevel == 'aa' || document.querySelectorAll('section.aa input[value="unverified"]:checked').length > 0) {
					status_label.textContent = _STATUS.aa;
					status_input.value = 'aa';
					return;
				}
			}
		}
		
		if (document.querySelectorAll('section.a input[value="fail"]:checked, section#eg-2 input[value="fail"]:checked').length == 0) {
			status_label.textContent = _STATUS.a;
			status_input.value = 'a';
		}
		
		else {
			status_label.textContent = _STATUS.fail;
			status_input.value = 'fail';
		}
	}
	
	
	return {
		STATUS: _STATUS,
		
		setWCAGConformanceLevel: function(level) {
			setWCAGConformanceLevel(level);
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
		
		setGlobalSCStatus(status) {
			if (!confirm('This action will change all current status fields and cannot be undone.\n\nPlease confirm to continue.')) {
				return;
			}
			var success_criteria = document.querySelectorAll('.a, .aa, .aaa, .epub');
			
			for (var i = 0; i < success_criteria.length; i++) {
				if (success_criteria[i].style.display !== 'none') {
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
			document.getElementById(options.name+'-fail').style.display = (options.value == 'fail') ? 'block' : 'none';
			
			setEvaluationResult();
		},
		
		showSCNoteField: function(sc_status_radio) {
		    document.getElementById(sc_status_radio.name).style.display = (sc_status_radio.checked) ? 'block' : 'none';
		},
		
		filterSCByStatus: function(radio) {
			var status_inputs = document.querySelectorAll('input.sc_status[value="' + radio.value + '"]:checked');
			for (var i = 0; i < status_inputs.length; i++) {
				var id = status_inputs[i].name;
				if (radio.checked) {
					document.getElementById(id).style.display = 'none';
				}
				else {
					var status_parent_section = document.getElementById(id);
					if (smartWCAG.WCAGClassList.indexOf('|'+status_parent_section.className+'|') !== -1) {
						status_parent_section.style.display = 'block';
					}
				}
			}
		},
		
		showSCBody: function(display) {
			var success_criteria = document.querySelectorAll('.sc-body');
			for (var i = 0; i < success_criteria.length; i++) {
				if (display) {
					success_criteria[i].removeAttribute('style');
				}
				else {
					success_criteria[i].style.display = 'none';
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

})(smartWCAG,smartFormat);
