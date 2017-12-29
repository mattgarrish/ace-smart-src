
'use strict';

var smartConformance = (function(smartWCAG,smartFormat) {
	var _SC_TYPE = new Object();
		_SC_TYPE.img = ['sc-1.4.9'];
		_SC_TYPE.audio = ['sc-1.4.2','sc-1.4.7'];
		_SC_TYPE.video = ['sc-1.2.2','sc-1.2.3','sc-1.2.5','sc-1.2.6','sc-1.2.7','sc-1.2.8'];
		_SC_TYPE.av = ['sc-1.2.1','sc-1.2.4','sc-1.2.9'];
		_SC_TYPE.script = ['sc-2.2.1','sc-2.2.4','sc-2.2.5','sc-3.2.1','sc-3.2.2','sc-3.3.1','sc-3.3.2','sc-3.3.3','sc-3.3.4','sc-3.3.5','sc-3.3.6'];
		_SC_TYPE.forms = ['sc-2.4.3'];
		_SC_TYPE.sf = ['sc-4.1.2'];

	var _STATUS = new Object();
		_STATUS.incomplete = 'Incomplete';
		_STATUS.fail = 'Failed';
		_STATUS.a = 'Pass - EPUB + WCAG Level A';
		_STATUS.aa = 'Pass - EPUB + WCAG Level AA';
		
		
	function changeConformance() {
	
		if (!document.getElementById('show-aa').checked) {
			showLevel('aa', (smartWCAG.WCAGLevel == 'aa') ? true : false);
		}
		
		// show "supserseded by" notes
		
		var sup = document.getElementsByClassName('superseded-aa');
		
		for (var i = 0; i < sup.length; i++) {
			sup[i].style.display = (smartWCAG.WCAGLevel == 'aa') ? 'block' : 'none';
		}
		
		smartWCAG.update();
	}
	
	
	function showLevel(level,show) {
		var elem_list = document.getElementsByClassName(level);
		
		for (var i = 0; i < elem_list.length; i++) { 
			elem_list[i].style.display = show ? 'block' : 'none';
		};
		
		smartWCAG.update();
	}
	
	
	function changeContentConformance(elem,type) {
	
		// hide partial sc checks
		var checks = document.querySelectorAll('*[data-scope="' + type + '"]');
		
		for (var i = 0; i < checks.length; i++) {
			checks[i].style.display = elem.checked ? 'none' : 'block';
		}
		
		// set completely inapplicable sc to n/a
		
		//  check set audio+video SC
		if (type=='audio' || type=='video') {
			var av = (document.getElementById('audio').checked || document.getElementById('video').checked) ? false : true;
			for (var i = 0; i < _SC_TYPE.av.length; i++) {
				// don't flip the status unless av is true or the status is currently 'na' (avoids overriding legit status when loading a saved report)
				var sc_status = document.querySelector('input[name="' + _SC_TYPE.av[i] + '"]:checked').value;
				if (av || sc_status == 'unverified') {
					document.querySelector('input[name="' + _SC_TYPE.av[i] + '"][value="' + (av ? 'unverified' : 'na') + '"]').click();
				}
			}
		}
		
		/* check whether to hide forms+scripting SC
		if (type=='forms' || type=='script') {
			var sf = (document.getElementById('forms').checked || document.getElementById('script').checked) ? false : true;
			for (var i = 0; i < _SC_TYPE.sf.length; i++) {
				// don't flip the status unless av is true or the status is currently 'na' (avoids overriding legit status when loading a saved report)
				var sc_status = document.querySelector('input[name="' + _SC_TYPE.sf[i] + '"]:checked').value;
				if (sf || sc_status == 'na') {
					document.querySelector('input[name="' + _SC_TYPE.sf[i] + '"][value="' + (sf ? 'unverified' : 'na') + '"]').click();
				}
			}
		}*/
		
		// hide/show all individual SC for the checked content type
		for (var i = 0; i < _SC_TYPE[type].length; i++) {
			document.querySelector('input[name="' + _SC_TYPE[type][i] + '"][value="' + (elem.checked ? 'na' : 'unverified') + '"]').click();
		}
	}
	
	
	function showNote(obj) {
	    document.getElementById(obj.name).style.display = (obj.checked) ? 'block' : 'none';
	}
	
	
	function setStatus(obj) {
		var sc_section = document.getElementById(obj.name); 
		
		/* clear off any existing classes */
		sc_section.classList.remove(smartFormat.BG.PASS,smartFormat.BG.ERR,smartFormat.BG.NA);
	
		if (obj.value == 'pass') {
			sc_section.classList.add(smartFormat.BG.PASS);
		}
		else if (obj.value == 'fail') {
			sc_section.classList.add(smartFormat.BG.ERR);
		}
		else if (obj.value == 'na') {
			sc_section.classList.add(smartFormat.BG.NA);
		}
		else {
			// leave with body bg
		}
		
		document.getElementById(obj.name+'-fail').style.display = (obj.value == 'fail') ? 'block' : 'none';
		
		setEvaluationResult();
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
	
	
	function setStatusAdmin(stat) {
		var sc = document.querySelectorAll('.a, .aa, .aaa, .epub');
		
		for (var i = 0; i < sc.length; i++) {
			if (sc[i].style.display !== 'none') {
				document.querySelector('input[name="' + sc[i].id + '"][value="' + stat + '"]').click();
			}
		}
	}
	
	
	function showLinks(show) {
		var details = document.getElementById('conformance').querySelectorAll('details');
		for (var i = 0; i < details.length; i++) {
			details[i].open = show;
		}
	}
	
	
	function showSC(elem,status) {
		var sc = document.querySelectorAll('input[value="' + status + '"]:checked');
		for (var i = 0; i < sc.length; i++) {
			var sc_id = sc[i].name;
			if (elem.checked) {
				document.getElementById(sc_id).style.display = 'none';
			}
			else {
				var sc_section = document.getElementById(sc_id);
				if (smartWCAG.WCAGClassList.indexOf('|'+sc_section.className+'|') !== -1) {
					sc_section.style.display = 'block';
				}
			}
		}
	}
	
	
	function showSCBody(show) {
		var sc = document.querySelectorAll('.sc-body');
		for (var i = 0; i < sc.length; i++) {
			if (show) {
				sc[i].removeAttribute('style');
			}
			else {
				sc[i].style.display = 'none';
			}
		}
	}
	
	
	return {
		SC_TYPE: _SC_TYPE,
		STATUS: _STATUS,
		setStatus: function(obj) {
			setStatus(obj);
		},
		showNote: function(obj) {
			showNote(obj);
		},
		showLevel: function(level,show) {
			showLevel(level,show);
		},
		showSC: function(elem,status) {
			showSC(elem,status);
		},
		showSCBody: function(show) {
			showSCBody(show);
		},
		showLinks: function(show) {
			showLinks(show);
		},
		changeConformance: function() {
			changeConformance();
		},
		changeContentConformance: function(elem,type) {
			changeContentConformance(elem,type);
		},
		enableAAOption: function(state) {
			document.getElementById('show-aa').disabled = (state == 'disable') ? true : false;
		}
	}

})(smartWCAG,smartFormat);
