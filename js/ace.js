
var ace = new Ace();

function Ace() {
	this.report = '';
}

Ace.prototype.storeJSON = function(json) {
	this.report = json;
}

Ace.prototype.loadReport = function(json) {

	// add metadata
	
	// load DC metadata
	var dc = ['title', 'identifier', 'creator', 'publisher'];
	
	for (var x = 0; x < dc.length; x++) {
		this.setMetadataString(dc[x],'dc:'+dc[x]);	
	}
	
	// load accessibility metadata
	this.setMetadataString('accessibilitySummary','schema:accessibilitySummary');
	var schema = ['accessibilityFeature', 'accessMode', 'accessibilityHazard', 'accessibilityAPI', 'accessibilityControl'];
	
	for (var i = 0; i < schema.length; i++) {
		this.setMetadataArray(schema[i], 'schema:'+schema[i]);	
	}
	
	this.setSufficientSets();
	
	// load certifier metadata - todo: unlikely to be present, but never know
	this.setMetadataString('certifier','a11y:certifiedBy');
	
	
	
	// configure manual checks
	
	this.configureReporting();
	
	/* save the report for reloading */
	document.getElementById('report').value = this.report;
}

Ace.prototype.setMetadataString = function(id,prop) {

	if (!this.report['earl:testSubject']['metadata'].hasOwnProperty(prop)) {
		return;
	}
	
	var str = '';
	
	var meta = this.report['earl:testSubject']['metadata'][prop];
	
	var pickOne = {"dc:title": true, "dc:identifier": true};
	
	if (Object.prototype.toString.call(meta) === '[object Array]') {
		
		if (pickOne.hasOwnProperty(prop)) {
			str = meta[0];
			if (id == 'dc:identifier') {
				str = this.formatIdentifier(str);
			}
		}
		
		else {
			for (var i = 0; i < meta.length; i++) {
				str += (i > 0) ? ', ' : '';
				str += meta[i];
			}
		}
	}
	else {
		if (prop == 'dc:identifier') {
			str = this.formatIdentifier(meta);
		}
		else {
			str = meta;
		}
	}
	document.getElementById(id).value = str;
}


Ace.prototype.formatIdentifier = function(identifier) {
	if (identifier.match(/urn:isbn:/i)) {
		identifier = 'ISBN ' + identifier.replace('urn:isbn:','');
	}
	else {
		identifier = identifier.replace(/urn:[a-z0-9]+:/i, '');
	}
	return identifier
}


Ace.prototype.setMetadataArray = function(id,prop) {
	
	if (!this.report['earl:testSubject']['metadata'].hasOwnProperty(prop)) {
		return;
	}
	
	var meta = this.report['earl:testSubject']['metadata'][prop];
	
	if (Object.prototype.toString.call(meta) === '[object Array]') {
		for (var i = 0; i < meta.length; i++) {
			// console.log('#' + id + ' input[value="' + meta[i] + '"]');
			var elem = document.querySelector('#' + id + ' input[value="' + meta[i] + '"]');
			
			if (id == 'accessibilityFeature' && elem == null) {
				disc.addCustomFeature(meta[i]);
				elem = document.querySelector('#' + id + ' input[value="' + meta[i] + '"]');
				elem.click();
			}
			
			if (elem == null) {
				console.log('Failed to load ace metadata string: #' + id + ' input[value="' + meta[i] + '"]'); 
				continue;
			}
			
			elem.click();
		}
	}
	
	else {
		var elem = document.querySelector('#' + id + ' input[value="' + meta + '"]');
		
		if (id == 'accessibilityFeature' && elem == null) {
			disc.addCustomFeature(meta);
			elem = document.querySelector('#' + id + ' input[value="' + meta + '"]');
		}
		
		if (elem == null) {
			console.log('Failed to load ace metadata string: #' + id + ' input[value="' + meta + '"]'); 
			return;
		}
		
		elem.click();
	}

}

Ace.prototype.setSufficientSets = function() {
	
	if (!this.report['earl:testSubject']['metadata'].hasOwnProperty('schema:accessModeSufficient')) {
		return;
	}
	
	var meta = this.report['earl:testSubject']['metadata']['schema:accessModeSufficient'];

	if (Object.prototype.toString.call(meta) === '[object Array]') {
		for (var i = 0; i < meta.length; i++) {
			if (i > 0) {
				disc.addSufficient();
			}
			
			var mode = meta[i].split(/[\s,]+/);
			
			for (var j = 0; j < mode.length; j++) {
				//console.log('#set' + (i+1) + ' input[value="' + mode[j] + '"]');
				document.querySelector('#set' + (i+1) + ' input[value="' + mode[j] + '"]').click();
			}
		}
	}
	
	else {
		var mode = meta[i].split(/[\s,]+/);
		
		for (var i = 0; i < mode.length; i++) {
			//console.log('#set' + (i+1) + ' input[value="' + mode[i] + '"]');
			document.querySelector('#set' + (i+1) + ' input[value="' + mode[i] + '"]').click();
		}
	}
}


Ace.prototype.configureReporting = function() {
	
	// this should be uncommented once all content info is in data and doesn't have to be parsed out of the toc
	//if (!this.report.hasOwnProperty('data')) {
	//	return;
	//}
	
	var alert_list = '';
	
	this.setPassFail();
	
	if (!this.configureChecks('img','images')) {
		alert_list += '- images\n';
	}
	
	// these should be automatable through configureChecks in the future
	if (!this.parseChecks('script', 'Scripted')) {
		alert_list += '- scripting\n';
	}
	
	if (!this.parseChecks('audio', 'Audio sources')) {
		alert_list += '- audio\n';
	}
	
	if (!this.parseChecks('video', 'Video sources')) {
		alert_list += '- video\n';
	}
	
	if (alert_list) {
		alert('The following content types were not reported present in the publication:\n\n' + alert_list + '\nChecks related to them have been turned off. To re-enable these checks, open the form configuration options.');
	}
}



Ace.prototype.setPassFail = function() {
	
	var ace_status = this.report['earl:result']['earl:outcome'];
	
	if (ace_status == 'pass') {
		
	}

}



Ace.prototype.configureChecks = function(id,prop) {
	
	var checkElem = document.getElementById(id);
	
	// clicking triggers conf.changeContentConformance to modify the form
	
	if (!this.report['data'].hasOwnProperty(prop)) {
		// uncheck since not present
		if (checkElem.checked) {
			checkElem.click();
		}
		return false;
	}
	
	else {
		if (!checkElem.checked) {
			checkElem.click();
		}
		return true;
	}
	
}

Ace.prototype.parseChecks = function(id,str) {

	// mimics configureChecks except have to use regexes to parse the toc outline for keywords
	
	var checkElem = document.getElementById(id);
	
	var toc = this.report['outlines']['toc'];
	
	var re = new RegExp('\\b'+str, 'i');
	
	if (!toc.match(re)) {
		if (checkElem.checked) {
			checkElem.click();
		}
		return false;
	}
	
	else {
		if (!checkElem.checked) {
			checkElem.click();
		}
		return true;
	}
}
