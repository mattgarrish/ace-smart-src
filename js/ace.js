
'use strict';

/* 
 * 
 * smartAce
 * 
 * Loads an Ace report into the reporting tool.
 * 
 * Public functions:
 * 
 * - storeReportJSON - stores the ace json output to _report
 * 
 * - loadReport - populates the ace data into the tool
 * 
 * 
 */

var smartAce = (function(smartConformance,smartDiscovery) {

	var _report = '';
	
	function loadReport() {
		setWCAGConformanceLevel();
		
		loadMetadata();
		
		var suggested = inferAccessibilityMetadata();
		
		// configure manual checks
		configureReporting(suggested);
		
		/* save the report for reloading */
		document.getElementById('report').value = _report;
	}
	
	function setWCAGConformanceLevel() {
		
		if (!_report['earl:testSubject']['metadata'].hasOwnProperty('dcterms:conformsTo')) {
			return;
		}
		
		var conf = _report['earl:testSubject']['metadata']['dcterms:conformsTo'].match(/http\:\/\/www\.idpf\.org\/epub\/a11y\/accessibility\-[0-9]+\.html\#wcag-(aa?)/);
		
		if (conf) {
			document.getElementById('conf-result-status').textContent = smartConformance.STATUS[conf];
			document.getElementById('conf-result').value = conf;
		}
	}
	
	function loadMetadata() {
	
		// load DC metadata
		var dc = ['title', 'identifier', 'creator', 'publisher', 'date', 'description', 'subject'];
		
		for (var x = 0; x < dc.length; x++) {
			setMetadataString(dc[x],'dc:'+dc[x]);	
		}
		
		// load DCTERMS metadata
		setDate('modified','dcterms:modified');
		
		// load accessibility metadata
		setMetadataString('accessibilitySummary','schema:accessibilitySummary');
		var schema = ['accessibilityFeature', 'accessMode', 'accessibilityHazard', 'accessibilityAPI', 'accessibilityControl'];
		
		for (var i = 0; i < schema.length; i++) {
			setMetadataArray(schema[i], 'schema:'+schema[i]);	
		}
		
		setSufficientSets();
		
		// load certifier metadata
		var a11y = ['certifiedBy', 'certifierReport'];
		
		for (var i = 0; i < a11y.length; i++) {
			setMetadataString(a11y[i], 'a11y:'+a11y[i]);	
		}
	}
	
	
	function setMetadataString(id,prop) {
	
		if (!_report['earl:testSubject']['metadata'].hasOwnProperty(prop)) {
			return;
		}
		
		var str = '';
		
		var meta = _report['earl:testSubject']['metadata'][prop];
		
		var pickOne = {"dc:title": true, "dc:identifier": true};
		
		if (Object.prototype.toString.call(meta) === '[object Array]') {
			
			if (pickOne.hasOwnProperty(prop)) {
				str = meta[0];
				if (id == 'dc:identifier') {
					str = formatIdentifier(str);
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
				str = formatIdentifier(meta);
			}
			else {
				str = meta;
			}
		}
		document.getElementById(id).value = str;
	}
	
	
	function setDate(id,prop) {
	
		if (!_report['earl:testSubject']['metadata'].hasOwnProperty(prop)) {
			console.log('Did not find date property ' + prop);
			return;
		}	
	
		var str = '';
		
		var date = _report['earl:testSubject']['metadata'][prop];
		
		var date_options = { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };  
		
		document.getElementById(id).value = (date == '') ? date : new Date(date).toLocaleDateString("en",date_options);
	
	}
	
	
	function formatIdentifier(identifier) {
		if (identifier.match(/urn:isbn:/i)) {
			identifier = 'ISBN ' + identifier.replace('urn:isbn:','');
		}
		else {
			identifier = identifier.replace(/urn:[a-z0-9]+:/i, '');
		}
		return identifier
	}
	
	
	function setMetadataArray(id,prop) {
		
		if (!_report['earl:testSubject']['metadata'].hasOwnProperty(prop)) {
			return;
		}
		
		var meta = _report['earl:testSubject']['metadata'][prop];
		
		if (Object.prototype.toString.call(meta) === '[object Array]') {
			for (var i = 0; i < meta.length; i++) {
				// console.log('#' + id + ' input[value="' + meta[i] + '"]');
				var elem = document.querySelector('#' + id + ' input[value="' + meta[i] + '"]');
				
				if (id == 'accessibilityFeature' && elem == null) {
					smartDiscovery.addCustomFeature(meta[i]);
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
				smartDiscovery.addCustomFeature(meta);
				elem = document.querySelector('#' + id + ' input[value="' + meta + '"]');
			}
			
			if (elem == null) {
				console.log('Failed to load ace metadata string: #' + id + ' input[value="' + meta + '"]'); 
				return;
			}
			
			elem.click();
		}
	
	}
	
	function setSufficientSets() {
		
		if (!_report['earl:testSubject']['metadata'].hasOwnProperty('schema:accessModeSufficient')) {
			return;
		}
		
		var meta = _report['earl:testSubject']['metadata']['schema:accessModeSufficient'];
	
		if (Object.prototype.toString.call(meta) === '[object Array]') {
			for (var i = 0; i < meta.length; i++) {
				if (i > 0) {
					smartDiscovery.addSufficient();
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
	
	
	function inferAccessibilityMetadata() {
	
		var msg = document.createElement('ul');
		
		// parse out a11y metadata values to set based on the report info
		
		if (_report['a11y-metadata']['present'].length > 0) {
			// if publication contains metadata, don't suggest more
			return '';
		}
		
		var hasAltText = false;
		
		if (_report['data'].hasOwnProperty('images')) {
			for (var i = 0; i < _report['data']['images'].length; i++) {
				if (_report['data']['images'][i].hasOwnProperty('alt') && _report['data']['images'][i]['alt'] != '') {
					hasAltText = true;
					msg.appendChild(setMetadata('accessibilityFeature','alternativeText'));
					break;
				}
			}		
		}
		
		if (_report['properties']['hasMathML']) {
			msg.appendChild(setMetadata('accessibilityFeature','MathML'));
		}
		
		if (_report['properties']['hasPageBreaks']) {
			msg.appendChild(setMetadata('accessibilityFeature','printPageNumbers'));
		}
		
		msg.appendChild(setMetadata('accessibilityFeature','readingOrder'));
		msg.appendChild(setMetadata('accessibilityFeature','tableOfContents'));
		
		// assuming any publication being assessed in not purely image-based
		msg.appendChild(setMetadata('accessMode','textual'));
		setSufficientMetadata(1,'textual');
		
		// track modes to set sufficient label later
		var sufficient = 'textual';
		
		if (hasAltText || _report.hasOwnProperty('videos')) {
			msg.appendChild(setMetadata('accessMode','visual'));
			setSufficientMetadata(1,'visual');
			sufficient += ', visual';
		}
		
		if (_report['data'].hasOwnProperty('audios')) {
			msg.appendChild(setMetadata('accessMode','auditory'));
			setSufficientMetadata(1,'auditory');
			sufficient += ', auditory';
		}
		
		var suff_li = document.createElement('li');
			suff_li.appendChild(document.createTextNode('accessModeSufficient: '+sufficient));
		msg.appendChild(suff_li);
		
		return msg.hasChildNodes() ? msg : '';
	
	}
	
	
	function setMetadata(property, meta_id) {
		document.querySelector('input[type="checkbox"][value="' + meta_id + '"]').click();
		var li = document.createElement('li');
			li.appendChild(document.createTextNode(property + ': ' + meta_id));
		return li;
	}
	
	
	function setSufficientMetadata(set_id, meta_id) {
		document.querySelector('fieldset#set' + set_id + ' input[type="checkbox"][value="' + meta_id + '"]').click();
	}
	
	
	function configureReporting(metadata_msg) {
		
		if (!_report.hasOwnProperty('data')) {
			return;
		}
		
		var alert_list = document.createElement('ul');
		
		setPassFail();
		
		if (!configureChecks('img','images')) {
			var li = document.createElement('li');
				li.appendChild(document.createTextNode('images'))
			alert_list.appendChild(li);
		}
		else {
			buildImageLists();
		}
		
		// these should be automatable through configureChecks in the future
		if (!configureChecks('script', 'scripts')) {
			var li = document.createElement('li');
				li.appendChild(document.createTextNode('scripting'))
			alert_list.appendChild(li);
		}
		
		if (!configureChecks('audio', 'audios')) {
			var li = document.createElement('li');
				li.appendChild(document.createTextNode('audio'))
			alert_list.appendChild(li);
		}
		
		if (!configureChecks('video', 'videos')) {
			var li = document.createElement('li');
				li.appendChild(document.createTextNode('video'))
			alert_list.appendChild(li);
		}
		
		if (!_report['properties']['hasPageBreaks']) {
			document.querySelector('input[name="eg-1"][value="na"]').click();
			var li = document.createElement('li');
				li.appendChild(document.createTextNode('page breaks'))
			alert_list.appendChild(li);
		}
		
		if (!_report['earl:testSubject']['metadata'].hasOwnProperty('media:narrator')) {
			document.querySelector('input[name="eg-2"][value="na"]').click();
			var li = document.createElement('li');
				li.appendChild(document.createTextNode('media overlays'))
			alert_list.appendChild(li);
		}
		
		setEPUBFeatureWarnings();
		
		var import_msg = document.getElementById('import');
		
		var success = document.createElement('p');
			success.appendChild(document.createTextNode('Ace report successfully imported!'));
		import_msg.appendChild(success);
		
		if (alert_list.hasChildNodes()) {
			var start_msg = document.createElement('p');
				start_msg.appendChild(document.createTextNode('The following content types were not reported present in the publication:'));
			import_msg.appendChild(start_msg);
			
			import_msg.appendChild(alert_list);
			
			var end_msg = document.createElement('p');
				end_msg.appendChild(document.createTextNode('Checks related to them have been turned off. To re-enable these checks, see the Conformance Verification tab.'));
			import_msg.appendChild(end_msg);
		}
		
		if (metadata_msg) {
			var start_msg = document.createElement('p');
				start_msg.appendChild(document.createTextNode('The following accessibiity metadata was set based on the Ace report:'));
			import_msg.appendChild(start_msg);
			
			import_msg.appendChild(metadata_msg);
			
			var end_msg = document.createElement('p');
				end_msg.appendChild(document.createTextNode('Verify the accuracy of these assumptions in the Discovery Metadata tab.'));
			import_msg.appendChild(end_msg);
		}
		
		import_dialog.dialog('open');
	}
	
	
	function configureChecks(id,prop) {
		
		var checkElem = document.getElementById(id);
		
		// clicking triggers smartConformance.changeContentConformance to modify the form
		
		if (!_report['data'].hasOwnProperty(prop)) {
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
	
	
	function buildImageLists() {
		var empty = new Array();
		var non_empty = new Array();
		
		_report['data']['images'].forEach(function(obj) {
			if (obj.alt == "") {
				empty.push(obj.location.substr(0,obj.location.lastIndexOf('#')) + ": " + obj.src );
			}
			else {
				non_empty.push(obj.location.substr(0,obj.location.lastIndexOf('#')) + ": " + obj.src + ": '" + obj.alt + "'");
			}
		});
		
		if (empty.length > 0) {
			makeImgList('img-empty',empty,'The following images have empty alt attributes:')
		}
		
		if (non_empty.length > 0) {
			makeImgList('img-non-empty',non_empty,'Verify the following images are not decorative:');
		}
	}
	
	
	function makeImgList(id,list,msg) {
		var sc_li = document.getElementById(id);
		var p = document.createElement('p');
			p.appendChild(document.createTextNode(msg));
			sc_li.appendChild(p);
		
		var ul = document.createElement('ul');
		
		for (var i = 0; i < list.length; i++) {
			var li = document.createElement('li');
			var code = document.createElement('code');
				code.appendChild(document.createTextNode(list[i]));
				li.appendChild(code);
				ul.appendChild(li);
		}
		
		sc_li.appendChild(ul);
	}
	
	
	function setPassFail() {
		
		var ace_status = _report['earl:result']['earl:outcome'];
		
		if (ace_status == 'pass') {
			setSCStatus('sc-3.1.1','pass'); // lang
		}
		
		else {
			if (!_report.hasOwnProperty('assertions')) {
				// problem with ace?
				console.log('Report did not pass but contains no failure assertions.');
				return;
			}
			
			var assert = compileAssertions();
			
			if (assert['accesskeys']) { setSCStatus('sc-2.1.1', 'fail', assert['accesskeys']); }
			if (assert['area-alt']) { setSCStatus('sc-1.1.1', 'fail', assert['area-alt']); }
			if (assert['aria-allowed-attr']) { setSCStatus('sc-4.1.1', 'fail', assert['aria-allowed-attr']); setSCStatus('sc-4.1.2', 'fail', assert['aria-allowed-attr']); }
			if (assert['aria-hidden-body']) { setSCStatus('sc-4.1.2', 'fail', assert['aria-hidden-body']); }
			if (assert['aria-required-attr']) { setSCStatus('sc-4.1.1', 'fail', assert['aria-required-attr']); setSCStatus('sc-4.1.2', 'fail', assert['aria-required-attr']); }
			if (assert['aria-required-children']) { setSCStatus('sc-1.3.1', 'fail', assert['aria-required-children']); }
			if (assert['aria-required-parent']) { setSCStatus('sc-1.3.1', 'fail', assert['aria-required-parent']); }
			if (assert['aria-roles']) { setSCStatus('sc-1.3.1', 'fail', assert['aria-roles']); setSCStatus('sc-4.1.1', 'fail', assert['aria-roles']); setSCStatus('sc-4.1.2', 'fail', assert['aria-roles']); }
			if (assert['aria-valid-attr-value']) { setSCStatus('sc-1.3.1', 'fail', assert['aria-valid-attr-value']); setSCStatus('sc-4.1.1', 'fail', assert['aria-valid-attr-value']); setSCStatus('sc-4.1.2', 'fail', assert['aria-valid-attr-value']); }
			if (assert['aria-valid-attr']) { setSCStatus('sc-4.1.1', 'fail', assert['aria-valid-attr']); }
			if (assert['audio-caption']) { setSCStatus('sc-1.2.2', 'fail', assert['audio-caption']); }
			if (assert['blink']) { setSCStatus('sc-2.2.2', 'fail', assert['blink']); }
			if (assert['button-name']) { setSCStatus('sc-4.1.2', 'fail', assert['button-name']); }
			if (assert['bypass']) { setSCStatus('sc-2.4.1', 'fail', assert['bypass']); }
			if (assert['color-contrast']) { setSCStatus('sc-1.4.3', 'fail', assert['color-contrast']); }
			if (assert['definition-list']) { setSCStatus('sc-1.3.1', 'fail', assert['definition-list']); }
			if (assert['dlitem']) { setSCStatus('sc-1.3.1', 'fail', assert['dlitem']); }
			if (assert['document-title']) { setSCStatus('sc-2.4.2', 'fail', assert['document-title']); }
			if (assert['duplicate-id']) { setSCStatus('sc-4.1.1', 'fail', assert['duplicate-id']); }
			if (assert['frame-title']) { setSCStatus('sc-2.4.1', 'fail', assert['frame-title']); }
			
			if (!assert['html-has-lang'] && !assert['html-lang-valid']) {
				setSCStatus('sc-3.1.1', 'pass', '');
			}
			else {
				if (assert['html-has-lang']) { setSCStatus('sc-3.1.1', 'fail', assert['html-has-lang']); }
				if (assert['html-lang-valid']) { setSCStatus('sc-3.1.1', 'fail', assert['html-lang-valid']); }
			}
			
			if (assert['image-alt']) { setSCStatus('sc-1.1.1', 'fail', assert['image-alt']); }
			if (assert['input-image-alt']) { setSCStatus('sc-1.1.1', 'fail', assert['input-image-alt']); }
			if (assert['label']) { setSCStatus('sc-1.3.1', 'fail'); setSCStatus('sc-3.3.2', 'fail', assert['label']); }
			if (assert['layout-table']) { setSCStatus('sc-1.3.1', 'fail', assert['layout-table']); }
			if (assert['link-in-text-block']) { setSCStatus('sc-1.4.1', 'fail', assert['link-in-text-block']); }
			if (assert['link-name']) { setSCStatus('sc-1.1.1', 'fail', assert['link-name']); setSCStatus('sc-2.4.4', 'fail', assert['link-name']); setSCStatus('sc-4.1.2', 'fail', assert['link-name']); }
			if (assert['list']) { setSCStatus('sc-1.3.1', 'fail', assert['list']); }
			if (assert['listitem']) { setSCStatus('sc-1.3.1', 'fail', assert['list-item']); }
			if (assert['marquee']) { setSCStatus('sc-2.2.2', 'fail', assert['marquee']); }
			if (assert['meta-refresh']) { setSCStatus('sc-2.2.1', 'fail', assert['meta-refresh']); setSCStatus('sc-2.2.4', 'fail', assert['meta-refresh']); setSCStatus('sc-3.2.5', 'fail', assert['meta-refresh']); }
			if (assert['meta-viewport']) { setSCStatus('sc-1.4.4', 'fail', assert['meta-viewport']); }
			if (assert['object-alt']) { setSCStatus('sc-1.1.1', 'fail', assert['object-alt']); }
			if (assert['p-as-heading']) { setSCStatus('sc-1.3.1', 'fail', assert['p-as-heading']); }
			if (assert['server-side-image-map']) { setSCStatus('sc-2.1.1', 'fail', assert['server-side-image-map']); }
			if (assert['table-fake-caption']) { setSCStatus('sc-1.3.1', 'fail', assert['table-has-header']); }
			if (assert['td-has-header']) { setSCStatus('sc-1.3.1', 'fail', assert['td-has-header']); }
			if (assert['td-headers-attr']) { setSCStatus('sc-1.3.1', 'fail', assert['td-headers-attr']); }
			if (assert['th-has-data-cells']) { setSCStatus('sc-1.3.1', 'fail', assert['td-has-data-cells']); }
			if (assert['valid-lang']) { setSCStatus('sc-3.1.2', 'fail', assert['valid-lang']); }
			if (assert['video-caption']) { setSCStatus('sc-1.2.2', 'fail', assert['video-caption']); setSCStatus('sc-1.2.3', 'fail', assert['video-caption']); }
			if (assert['video-description']) { setSCStatus('sc-1.2.5', 'fail', assert['video-description']); }
		}
	}
	
	
	function setSCStatus(id, status, msg) {
		document.querySelector('input[name="'+id+'"][value="' + status + '"]').click();
		if (status == 'fail') {
			document.querySelector('textarea[id="'+id+'-err"]').value += msg + '\n';
		}
	}
	
	
	function compileAssertions() {
		var failure = {};
		for (var i = 0; i < _report['assertions'].length; i++) {
			
			if (!_report['assertions'][i].hasOwnProperty('assertions')) { 
				console.log('Document assertions has no sub-assertions');
				continue;
			}
			
			for (var j = 0; j <  _report['assertions'][i]['assertions'].length; j++) {
				
				if (!_report['assertions'][i]['assertions'][j].hasOwnProperty('earl:test')) {
					console.log('Document assertions does not have an earl:test section');
					continue;
				}
				
				if (!_report['assertions'][i]['assertions'][j]['earl:test'].hasOwnProperty('dct:title')) {
					console.log('Assertion test has no title');
					continue;
				}
				
				if (!failure.hasOwnProperty(_report['assertions'][i]['assertions'][j]['earl:test']['dct:title'])) {
					failure[_report['assertions'][i]['assertions'][j]['earl:test']['dct:title']] = '';
				}
				
				failure[_report['assertions'][i]['assertions'][j]['earl:test']['dct:title']] += _report['assertions'][i]['assertions'][j]['earl:result']['dct:description'].replace(/Fix (any|all) of the following:\s+/i,'') + ' (' + _report['assertions'][i]['earl:testSubject']['url'] + ').\n';
			}
		}
		return failure;
	}
	
	
	function setEPUBFeatureWarnings() {
		
		var feature = {'manifest': 'hasManifestFallbacks', 'bindings': 'hasBindings', 'switch': 'epub-switches', 'trigger': 'epub-triggers'};
		var showWarning = true;
		
		for (var key in feature) {
			
			if  ((_report['properties'].hasOwnProperty(feature[key]) && _report['properties'][feature[key]])
					|| _report['data'].hasOwnProperty(feature[key])) {
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
	
	return {
		storeReportJSON: function(json) {
			_report = json;
		},
		
		loadReport: function() {
			loadReport();
		}
	}

})(smartConformance,smartDiscovery);
