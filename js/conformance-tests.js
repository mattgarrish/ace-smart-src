
var conf = new Conformance();

function Conformance() {
	this.wcag_level = 'a';
	
	this.SC_TYPE = new Object();
	this.SC_TYPE.img = ['sc-1.4.9'];
	this.SC_TYPE.audio = ['sc-1.4.2','sc-1.4.7'];
	this.SC_TYPE.video = ['sc-1.2.2','sc-1.2.3','sc-1.2.5','sc-1.2.6','sc-1.2.7','sc-1.2.8'];
	this.SC_TYPE.av = ['sc-1.2.1','sc-1.2.4','sc-1.2.9'];
	this.SC_TYPE.script = ['sc-2.2.1','sc-2.2.4','sc-2.2.5','sc-3.2.1','sc-3.2.2'];
	this.SC_TYPE.forms = ['sc-2.4.3','sc-3.3.1','sc-3.3.2','sc-3.3.3','sc-3.3.4'];
	this.SC_TYPE.sf = ['sc-4.1.2'];

}

Conformance.prototype.changeConformance = function() {

	if (!document.getElementById('show-aa').checked) {
		this.showLevel('aa', (this.wcag_level == 'aa') ? true : false);
	}
	
	// show "supserseded by" notes
	
	var sup = document.getElementsByClassName('superseded-aa');
	
	for (var i = 0; i < sup.length; i++) {
		sup[i].style.display = (this.wcag_level == 'aa') ? 'block' : 'none';
	}
	
	// switch the conformance result to match new configuration
	document.querySelector('input[name="conf-result"][value="' + this.wcag_level + '"]').click();
}


Conformance.prototype.showLevel = function(level,show) {
	var elem_list = document.getElementsByClassName(level);
	
	for (var i = 0; i < elem_list.length; i++) { 
		elem_list[i].style.display = show ? 'block' : 'none';
	};
}


Conformance.prototype.changeContentConformance = function(elem,type) {

	// used to ensure that a sc should be displayed based on what the user has selected for reporting
	var wcag_show = 'a';
		wcag_show += this.wcag_level == 'aa' ? ',aa' : (document.getElementById('show-aa').checked ? ',aa' : '');
		wcag_show += document.getElementById('show-aaa').checked ? ',aaa' : '';
	
	// hide partial sc checks
	var checks = document.querySelectorAll('*[data-scope="' + type + '"]');
	
	for (var i = 0; i < checks.length; i++) {
		checks[i].style.display = elem.checked ? 'block' : 'none';
	}
	
	// set completely inapplicable sc to n/a
	
	//  check set audio+video SC
	if (type=='audio' || type=='video') {
		var av = (document.getElementById('audio').checked || document.getElementById('video').checked) ? true : false;
		for (var i = 0; i < this.SC_TYPE.av.length; i++) {
			var sc_section = document.getElementById(this.SC_TYPE.av[i]);
			var sc_req = sc_section.querySelector('div.sc-body');
			if (sc_section.classList.contains(wcag_show)) {
				//console.log(this.SC_TYPE.av[i]);
				if (sc_req !== null) {
					sc_req.style.display = elem.checked ? 'block' : 'none';
				}
				// don't flip the status unless av is true or the status is currently 'na' (avoids overriding legit status when loading a saved report)
				var sc_status = document.querySelector('input[name="' + this.SC_TYPE.av[i] + '"]:checked').value;
				if (!av || sc_status == 'unverified') {
					document.querySelector('input[name="' + this.SC_TYPE.av[i] + '"][value="' + (av ? 'unverified' : 'na') + '"]').click();
				}
			}
		}
	}
	
	// check whether to hide forms+scripting SC
	if (type=='forms' || type=='script') {
		var sf = (document.getElementById('forms').checked || document.getElementById('script').checked) ? true : false;
		for (var i = 0; i < this.SC_TYPE.sf.length; i++) {
			var sc_section = document.getElementById(this.SC_TYPE.sf[i]);
			var sc_req = sc_section.querySelector('div.sc-body');
			if (sc_section.classList.contains(wcag_show)) {
				//console.log(this.SC_TYPE.sf[i]);
				if (sc_req !== null) {
					sc_req.style.display = elem.checked ? 'block' : 'none';
				}
				// don't flip the status unless av is true or the status is currently 'na' (avoids overriding legit status when loading a saved report)
				var sc_status = document.querySelector('input[name="' + this.SC_TYPE.sf[i] + '"]:checked').value;
				if (!sf || sc_status == 'na') {
					document.querySelector('input[name="' + this.SC_TYPE.sf[i] + '"][value="' + (sf ? 'unverified' : 'na') + '"]').click();
				}
			}
		}
	}
	
	// hide/show all individual SC for the checked content type
	for (var i = 0; i < this.SC_TYPE[type].length; i++) {
		var sc_section = document.getElementById(this.SC_TYPE[type][i]);
		var sc_req = sc_section.querySelector('div.sc-body');
		if (sc_section.classList.contains(wcag_show)) {
			//console.log(this.SC_TYPE[type][i]);
			if (sc_req !== null) {
				sc_req.style.display = elem.checked ? 'block' : 'none';
			}
			document.querySelector('input[name="' + this.SC_TYPE[type][i] + '"][value="' + (elem.checked ? 'unverified' : 'na') + '"]').click();
		}
	}
}


Conformance.prototype.showNote = function(obj) {
    document.getElementById(obj.name).style.display = (obj.checked) ? 'block' : 'none';
}


Conformance.prototype.WCAGOption = function(state) {
	document.getElementById('show-aa').disabled = (state == 'disable') ? true : false;
}


Conformance.prototype.setStatus = function(obj) {
	var parentSection = document.getElementById(obj.name); 
	
	/* clear off any existing classes */
	parentSection.classList.remove(format.BG.PASS,format.BG.ERR,format.BG.NA);

	if (obj.value == 'pass') {
		parentSection.classList.add(format.BG.PASS);
	}
	else if (obj.value == 'fail') {
		parentSection.classList.add(format.BG.ERR);
	}
	else if (obj.value == 'na') {
		parentSection.classList.add(format.BG.NA);
	}
	else {
		// leave with body bg
	}
	
	document.getElementById(obj.name+'-fail').style.display = (obj.value == 'fail') ? 'block' : 'none';
}


Conformance.prototype.setStatusAdmin = function(stat) {
	var sc = document.querySelectorAll('.a, .aa, .aaa, .epub');
	
	for (var i = 0; i < sc.length; i++) {
		if (sc[i].style.display !== 'none') {
			document.querySelector('input[name="' + sc[i].id + '"][value="' + stat + '"]').click();
		}
	}
}
