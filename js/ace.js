
var ace = new Ace();

function Ace() {
	this.report = '';
}

Ace.prototype.storeJSON = function(json) {
	this.report = json;
}

Ace.prototype.loadReport = function(json) {

	manage.clear(true);
	
	// add metadata
	
	// load DC metadata
	var dc = ['title', 'identifier', 'creator', 'publisher', 'date', 'description', 'subject'];
	
	for (var x = 0; x < dc.length; x++) {
		this.setMetadataString(dc[x],'dc:'+dc[x]);	
	}
	
	// load DCTERMS metadata
	this.setDate('modified','dcterms:modified');
	
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


Ace.prototype.setDate = function(id,prop) {

	if (!this.report['earl:testSubject']['metadata'].hasOwnProperty(prop)) {
		console.log('Did not find date property ' + prop);
		return;
	}	

	var str = '';
	
	var date = this.report['earl:testSubject']['metadata'][prop];
	
	var date_options = { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };  
	
	document.getElementById(id).value = (date == '') ? date : new Date(date).toLocaleDateString("en",date_options);

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
		var mode = meta.split(/[\s,]+/);
		
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
	if (!this.configureChecks('script', 'scripts')) {
		alert_list += '- scripting\n';
	}
	
	if (!this.configureChecks('audio', 'audios')) {
		alert_list += '- audio\n';
	}
	
	if (!this.configureChecks('video', 'videos')) {
		alert_list += '- video\n';
	}
	
	this.setEPUBFeatureWarnings();
	
	if (alert_list) {
		alert('The following content types were not reported present in the publication:\n\n' + alert_list + '\nChecks related to them have been turned off. To re-enable these checks, refer to the WCAG configuration options.');
	}
}



Ace.prototype.configureChecks = function(id,prop) {
	
	var checkElem = document.getElementById(id);
	
	// clicking triggers conf.changeContentConformance to modify the form
	
	if (!this.report['data'].hasOwnProperty(prop)) {
		// uncheck since not present
		if (!checkElem.checked) {
			checkElem.click();
		}
		return false;
	}
	
	else {
		if (checkElem.checked) {
			checkElem.click();
		}
		return true;
	}
	
}

/*
Ace.prototype.parseChecks = function(id,str) {

	// mimics configureChecks except have to use regexes to parse the toc outline for keywords
	
	var checkElem = document.getElementById(id);
	
	var toc = this.report['outlines']['toc'];
	
	var re = new RegExp('\\b'+str, 'i');
	
	if (!toc.match(re)) {
		if (!checkElem.checked) {
			checkElem.click();
		}
		return false;
	}
	
	else {
		if (checkElem.checked) {
			checkElem.click();
		}
		return true;
	}
}
*/



Ace.prototype.setPassFail = function() {
	
	var ace_status = this.report['earl:result']['earl:outcome'];
	
	if (ace_status == 'pass') {
		this.setSCStatus('sc-3.1.1','pass'); // lang
	}
	
	else {
		if (!this.report.hasOwnProperty('assertions')) {
			// problem with ace?
			console.log('Report did not pass but contains no failure assertions.');
			return;
		}
		
		var assert = this.compileAssertions();
		
		if (assert['accesskeys']) { this.setSCStatus('sc-2.1.1', 'fail'); }
		if (assert['area-alt']) { this.setSCStatus('sc-1.1.1', 'fail'); }
		if (assert['aria-allowed-attr']) { this.setSCStatus('sc-4.1.1', 'fail'); this.setSCStatus('sc-4.1.2', 'fail'); }
		if (assert['aria-hidden-body']) { this.setSCStatus('sc-4.1.2', 'fail'); }
		if (assert['aria-required-attr']) { this.setSCStatus('sc-4.1.1', 'fail'); this.setSCStatus('sc-4.1.2', 'fail'); }
		if (assert['aria-required-children']) { this.setSCStatus('sc-1.3.1', 'fail'); }
		if (assert['aria-required-parent']) { this.setSCStatus('sc-1.3.1', 'fail'); }
		if (assert['aria-roles']) { this.setSCStatus('sc-1.3.1', 'fail'); this.setSCStatus('sc-4.1.1', 'fail'); this.setSCStatus('sc-4.1.2', 'fail'); }
		if (assert['aria-valid-attr-value']) { this.setSCStatus('sc-1.3.1', 'fail'); this.setSCStatus('sc-4.1.1', 'fail'); this.setSCStatus('sc-4.1.2', 'fail'); }
		if (assert['aria-valid-attr']) { this.setSCStatus('sc-4.1.1', 'fail'); }
		if (assert['audio-caption']) { this.setSCStatus('sc-1.2.2', 'fail'); }
		if (assert['blink']) { this.setSCStatus('sc-2.2.2', 'fail'); }
		if (assert['button-name']) { this.setSCStatus('sc-4.1.2', 'fail'); }
		if (assert['bypass']) { this.setSCStatus('sc-2.4.1', 'fail'); }
		if (assert['color-contrast']) { this.setSCStatus('sc-1.4.3', 'fail'); }
		if (assert['definition-list']) { this.setSCStatus('sc-1.3.1', 'fail'); }
		if (assert['dlitem']) { this.setSCStatus('sc-1.3.1', 'fail'); }
		if (assert['document-title']) { this.setSCStatus('sc-2.4.2', 'fail'); }
		if (assert['duplicate-id']) { this.setSCStatus('sc-4.1.1', 'fail'); }
		if (assert['frame-title']) { this.setSCStatus('sc-2.4.1', 'fail'); }
		
		this.setSCStatus('sc-3.1.1', ((assert['html-has-lang'] || assert['html-lang-valid']) ? 'fail' : 'pass'));
		
		if (assert['image-alt']) { this.setSCStatus('sc-1.1.1', 'fail'); }
		if (assert['input-image-alt']) { this.setSCStatus('sc-1.1.1', 'fail'); }
		if (assert['label']) { this.setSCStatus('sc-1.3.1', 'fail'); this.setSCStatus('sc-3.3.2', 'fail'); }
		if (assert['layout-table']) { this.setSCStatus('sc-1.3.1', 'fail'); }
		if (assert['link-in-text-block']) { this.setSCStatus('sc-1.4.1', 'fail'); }
		if (assert['link-name']) { this.setSCStatus('sc-1.1.1', 'fail'); this.setSCStatus('sc-2.4.4', 'fail'); this.setSCStatus('sc-4.1.2', 'fail'); }
		if (assert['list']) { this.setSCStatus('sc-1.3.1', 'fail'); }
		if (assert['listitem']) { this.setSCStatus('sc-1.3.1', 'fail'); }
		if (assert['marquee']) { this.setSCStatus('sc-2.2.2', 'fail'); }
		if (assert['meta-refresh']) { this.setSCStatus('sc-2.2.1', 'fail'); this.setSCStatus('sc-2.2.4', 'fail'); this.setSCStatus('sc-3.2.5', 'fail'); }
		if (assert['meta-viewport']) { this.setSCStatus('sc-1.4.4', 'fail'); }
		if (assert['object-alt']) { this.setSCStatus('sc-1.1.1', 'fail'); }
		if (assert['p-as-heading']) { this.setSCStatus('sc-1.3.1', 'fail'); }
		if (assert['server-side-image-map']) { this.setSCStatus('sc-2.1.1', 'fail'); }
		if (assert['table-fake-caption']) { this.setSCStatus('sc-1.3.1', 'fail'); }
		if (assert['td-has-header']) { this.setSCStatus('sc-1.3.1', 'fail'); }
		if (assert['td-headers-attr']) { this.setSCStatus('sc-1.3.1', 'fail'); }
		if (assert['th-has-data-cells']) { this.setSCStatus('sc-1.3.1', 'fail'); }
		if (assert['valid-lang']) { this.setSCStatus('sc-3.1.2', 'fail'); }
		if (assert['video-caption']) { this.setSCStatus('sc-1.2.2', 'fail'); this.setSCStatus('sc-1.2.3', 'fail'); }
		if (assert['video-description']) { this.setSCStatus('sc-1.2.5', 'fail'); }
	}
}


Ace.prototype.setSCStatus = function(id, status) {
	document.querySelector('input[name="'+id+'"][value="' + status + '"]').click();
}



Ace.prototype.compileAssertions = function() {
	var failure = {};
	for (var i = 0; i < this.report['assertions'].length; i++) {
		
		if (!this.report['assertions'][i].hasOwnProperty('assertions')) { 
			console.log('Document assertions has no sub-assertions');
			continue;
		}
		
		for (var j = 0; j <  this.report['assertions'][i]['assertions'].length; j++) {
			
			if (!this.report['assertions'][i]['assertions'][j].hasOwnProperty('earl:test')) {
				console.log('Document assertions does not have an earl:test section');
				continue;
			}
			
			if (!this.report['assertions'][i]['assertions'][j]['earl:test'].hasOwnProperty('dct:title')) {
				console.log('Assertion test has no title');
				continue;
			}
			
			failure[this.report['assertions'][i]['assertions'][j]['earl:test']['dct:title']] = true;
		}
	}
	return failure;
}


Ace.prototype.setEPUBFeatureWarnings = function() {
	
	var feature = {'manifest': 'manifest fallback', 'bindings': 'bindings', 'epub-trigger': 'epub:trigger', 'epub-switch': 'epub:switch'};
	var toc = this.report['outlines']['toc'];
	var showWarning = true;
	
	for (var key in feature) {
		
		var re = new RegExp('\\b'+feature[key], 'i');
		
		if  (toc.match(re)) {
			var elem = document.getElementsByClassName(key);
			
			for (var i = 0; i < elem.length; i++) {
				elem[i].style.display = 'list-item';
			}
			
			if (showWarning) {
				document.getElementById('fallbacks').style.display = 'block';
				showWarning = false;
			}
		}
	}
}
