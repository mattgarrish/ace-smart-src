
'use strict';

/* 
 * 
 * smartAce
 * 
 * Loads an Ace report into the reporting tool.
 * 
 * Public functions:
 * 
 * - storeReportJSON - stores the ace json output to _aceReport
 * 
 * - loadReport - populates the ace data into the tool
 * 
 * 
 */

var smartAce = (function() {

	/* holds the ace report json */
	var _aceReport = '';
	
	/* holds status messages to report to the user after loading */
	var _loadMessages = {
			inferred: '',
			reporting: '',
			features: []
	};
	
	/* used to process incoming a11y metadata case-insensitively */
	var _SCHEMA_MAP = {
		accessibilityFeature: {
			alternativetext: 'alternativeText',
			annotations: 'annotations',
			audiodescription: 'audioDescription',
			bookmarks: 'bookmarks',
			braille: 'braille',
			captions: 'captions',
			chemml: 'ChemML',
			describedmath: 'describedMath',
			displaytransformability: 'displayTransformability',
			highcontrastaudio: 'highContrastAudio',
			highcontrastdisplay: 'highContrastDisplay',
			index: 'index',
			largeprint: 'largePrint',
			latex: 'latex',
			longdescription: 'longDescription',
			mathml: 'MathML',
			none: 'none',
			printpagenumbers: 'printPageNumbers',
			readingorder: 'readingOrder',
			rubyannotations: 'rubyAnnotations',
			signlanguage: 'signLanguage',
			structuralnavigation: 'structuralNavigation',
			synchronizedaudiotext: 'synchronizedAudioText',
			tableofcontents: 'tableOfContents',
			tactilegraphic: 'tactileGraphic',
			tactileobject: 'tactileObject',
			timingcontrol: 'timingControl',
			transcript: 'transcript',
			ttsMarkup: 'ttsmarkup'
		},
		accessibilityAPI: {
			aria: 'ARIA'
		}
	};
	
	
	/* 
	 * loadAceReport processes the incoming Ace JSON report
	 * and configures/populates the evaluation
	 */
	
	function loadAceReport() {
	
		if (!_aceReport) {
			alert('Ace report does not contain any data. Failed to load.');
			return;
		}
		
		/* extract and set the conformance level if the publication already contains conformsTo metadata */
		setWCAGConformanceLevel();
		
		/* iterate over the report metadata and set fields */
		loadMetadata();
		
		/* attempt to infer SC and discovery metadata from the data */
		inferAccessibilityMetadata();
		
		/* disable SC for any inapplicable content types */
		configureReporting();
		
		/* load extension data */
		if (Object.keys(smart_extensions).length > 0) {
			for (var key in smart_extensions) {
				smart_extensions[key].loadData(_aceReport);
			}
		}
		
		/* display information about the load to the user */
		showReportLoadResult();
	
	}
	
	
	/* 
	 * check the ace metadata for a dcterms:conformsTo property and set
	 * the WCAG level if it matches the epub accessibility conformance URL
	 */
	
	function setWCAGConformanceLevel() {
		
		var conformance_url = '';
		
		if (_aceReport['earl:testSubject'].hasOwnProperty('links') && _aceReport['earl:testSubject'].hasOwnProperty('dcterms:conformsTo')) {
			conformance_url = _aceReport['earl:testSubject'].links['dcterms:conformsTo'];
		}
		
		else if (_aceReport['earl:testSubject'].metadata.hasOwnProperty('dcterms:conformsTo')) {
			conformance_url = _aceReport['earl:testSubject'].metadata['dcterms:conformsTo'];
		}
		
		else {
			return;
		}
		
		var conformance_level = conformance_url.match(/http\:\/\/www\.idpf\.org\/epub\/a11y\/accessibility\-[0-9]+\.html\#wcag-(aa?)/);
		
		if (conformance_level) {
			document.getElementById('conformance-result-status').textContent = smartConformance.STATUS[conformance_level];
			document.getElementById('conformance-result').value = conformance_level;
		}
	}
	
	
	/* 
	 * iterates over the metadata extracted from the package document and updates the pub info tab
	 */
	
	function loadMetadata() {
	
		// set DC metadata
		var dc_elements = ['title', 'identifier', 'creator', 'publisher', 'date', 'description', 'subject'];
		
		for (var i = 0; i < dc_elements.length; i++) {
			document.getElementById(dc_elements[i]).value = formatMetadataProperty(dc_elements[i],'dc:'+dc_elements[i]);	
		}
		
		// set DCTERMS metadata
		if (_aceReport['earl:testSubject']['metadata'].hasOwnProperty('dcterms:modified')) {
			document.getElementById('modified').value = smartFormat.convertUTCDateToString(_aceReport['earl:testSubject']['metadata']['dcterms:modified']);
		}	
		
		// set discovery metadata
		
		var discovery_checkbox_properties = ['accessibilityFeature', 'accessMode', 'accessibilityHazard', 'accessibilityAPI', 'accessibilityControl'];
		
		for (var i = 0; i < discovery_checkbox_properties.length; i++) {
			setDiscoveryCheckboxes(discovery_checkbox_properties[i], 'schema:'+discovery_checkbox_properties[i]);	
		}
		
		setSufficientSets();
		
		document.getElementById('accessibilitySummary').value = formatMetadataProperty('accessibilitySummary','schema:accessibilitySummary');
		
		// set evaluator metadata
		
		document.getElementById('certifiedBy').value = formatMetadataProperty('certifiedBy', 'a11y:certifiedBy');
		
		// evaluator links that could be in meta or link elements
		var evaluator_links = ['certifierReport'];
		
		for (var i = 0; i < evaluator_links.length; i++) {
		
			var evaluator_value = '';
			
			if (_aceReport['earl:testSubject'].hasOwnProperty('links') &&_aceReport['earl:testSubject'].links.hasOwnProperty('a11y:'+evaluator_links[i])) {
				evaluator_value = _aceReport['earl:testSubject'].links['a11y:'+evaluator_links[i]];
			}
			
			else if (_aceReport['earl:testSubject'].metadata.hasOwnProperty('a11y:'+evaluator_links[i])) {
				evaluator_value = _aceReport['earl:testSubject'].metadata['a11y:'+evaluator_links[i]];
			}
			
			else {
				continue;
			}

			document.getElementById(evaluator_links[i]).value = evaluator_value;	
		}
	}
	
	
	/* 
	 * processes each metadata property to return the appropriate string value
	 */
	
	function formatMetadataProperty(id, property) {
	
		if (!_aceReport['earl:testSubject']['metadata'].hasOwnProperty(property)) {
			return '';
		}
		
		var report_property = _aceReport['earl:testSubject']['metadata'][property];
		
		var formatted_value = '';
		
		// for these properties, only the first instance found is used when there are multiple available
		var select_first_instance = {"dc:title": true, "dc:identifier": true};
		
		/* 
		 * if the specified property contains an array of values, selects either
		 * the first value (for those defined above) or concatenates the values
		 * together into a comma-separated list
		 * 
		 * for single values, identifiers are processed differently to format URNs
		 */
		
		if (Array.isArray(report_property)) {
			
			if (select_first_instance.hasOwnProperty(property)) {
				
				if (id == 'dc:identifier') {
					formatted_value = smartFormat.formatIdentifier(report_property[0]);
				}
				
				else {
					formatted_value = report_property[0];
				}
			}
			
			else {
				for (var i = 0; i < report_property.length; i++) {
					formatted_value += (i > 0) ? ', ' : '';
					formatted_value += report_property[i];
				}
			}
		}
		
		else {
			if (property == 'dc:identifier') {
				formatted_value = smartFormat.formatIdentifier(report_property);
			}
			else {
				formatted_value = report_property;
			}
		}
		
		return formatted_value;
	}
	
	
	/* 
	 * runs through any accessibility metadata extracted from the publication
	 * and checks off or fills in the appropriate field in the discovery
	 * metadata tab  
	 */
	
	function setDiscoveryCheckboxes(id, property) {
		
		if (!_aceReport['earl:testSubject']['metadata'].hasOwnProperty(property)) {
			return;
		}
		
		var report_property = Array.isArray(_aceReport['earl:testSubject']['metadata'][property]) ? 
				_aceReport['earl:testSubject']['metadata'][property] :
				[ _aceReport['earl:testSubject']['metadata'][property] ];
		
		
		for (var i = 0; i < report_property.length; i++) {
			
			var value = (_SCHEMA_MAP.hasOwnProperty(id) && _SCHEMA_MAP[id].hasOwnProperty(report_property[i])) ? _SCHEMA_MAP[id][report_property[i].toLowerCase()] : report_property[i];
			
			var checkbox = document.querySelector('#' + id + ' input[value="' + value + '"]');
			
			if (id == 'accessibilityFeature' && checkbox === null) {
				smartDiscovery.addCustomFeature(report_property[i]);
				checkbox = document.querySelector('#' + id + ' input[value="' + report_property[i] + '"]');
				_loadMessages.features.push(report_property[i]);
			}
			
			if (checkbox === null) {
				console.log('Failed to load ace metadata string: #' + id + ' input[value="' + report_property[i] + '"]');
				continue;
			}
			
			if (!checkbox.checked) {
				checkbox.click();
			}
		}
	}
	
	
	/* 
	 * because sufficient access modes are a list of 1..n access modes
	 * these have to be separately processed from the rest of the metadata
	 * by splitting/looping over the values in each set
	 */
	
	function setSufficientSets() {
		
		if (!_aceReport['earl:testSubject']['metadata'].hasOwnProperty('schema:accessModeSufficient')) {
			return;
		}
		
		// if there is only one set, pushes it into an array so that the following loop never fails
		var report_sets = Array.isArray(_aceReport['earl:testSubject']['metadata']['schema:accessModeSufficient']) ?
						_aceReport['earl:testSubject']['metadata']['schema:accessModeSufficient'] :
						[ _aceReport['earl:testSubject']['metadata']['schema:accessModeSufficient'] ];
	
		for (var i = 0; i < report_sets.length; i++) {
		
			var access_modes = report_sets[i].split(/[\s,]+/);
			
			for (var j = 0; j < access_modes.length; j++) {
				document.querySelector('#set' + (i+1) + ' input[value="' + access_modes[j] + '"]').click();
			}
			
			/* add an additional set so the user always has one blank one left to work with */
			if (i > 0) {
				smartDiscovery.addNewSufficientSet();
			}
		}
	}
	
	
	/* 
	 * attempts to infer accessibility features from the metadata
	 */
	
	function inferAccessibilityMetadata() {
	
		if (_aceReport['a11y-metadata']['present'].length > 0) {
			// if publication contains metadata, don't suggest more
			return '';
		}
		
		var user_message = document.createElement('ul');
		
		// parse out a11y metadata values to set based on the report info
		
		var hasAltText = false;
		
		if (_aceReport['data'].hasOwnProperty('images')) {
			for (var i = 0; i < _aceReport['data']['images'].length; i++) {
				if (_aceReport['data']['images'][i].hasOwnProperty('alt') && _aceReport['data']['images'][i]['alt'] != '') {
					hasAltText = true;
					user_message.appendChild(setCheckbox('accessibilityFeature','alternativeText'));
					setONIXCheckbox('14');
					break;
				}
			}
		}
		
		if (_aceReport['properties']['hasMathML']) {
			user_message.appendChild(setCheckbox('accessibilityFeature','MathML'));
			setONIXCheckbox('17');
		}
		
		if (_aceReport['properties']['hasPageBreaks']) {
			user_message.appendChild(setCheckbox('accessibilityFeature','printPageNumbers'));
			setONIXCheckbox('19');
		}
		
		/* can typically be assumed that every epub has a reading order */
		user_message.appendChild(setCheckbox('accessibilityFeature','readingOrder'));
		setONIXCheckbox('13');
		
		/* can typically be assumed that every epub has a table of contents */
		user_message.appendChild(setCheckbox('accessibilityFeature','tableOfContents'));
		setONIXCheckbox('11');
		
		// assuming any publication being assessed in not purely image-based
		user_message.appendChild(setCheckbox('accessMode','textual'));
		setSufficientMode(1,'textual');
		
		// track modes to set sufficient label later
		var sufficient = 'textual';
		
		if (hasAltText || _aceReport.hasOwnProperty('videos')) {
			user_message.appendChild(setCheckbox('accessMode','visual'));
			setSufficientMode(1,'visual');
			sufficient += ', visual';
		}
		
		if (_aceReport['data'].hasOwnProperty('audios')) {
			user_message.appendChild(setCheckbox('accessMode','auditory'));
			setSufficientMode(1,'auditory');
			sufficient += ', auditory';
		}
		
		var sufficient_message = document.createElement('li');
			sufficient_message.appendChild(document.createTextNode('accessModeSufficient: '+sufficient));
		user_message.appendChild(sufficient_message);
		
		/* check if media overlays are present */
		if (_aceReport['earl:testSubject']['metadata'].hasOwnProperty('media:duration')) {
			user_message.appendChild(setCheckbox('accessibilityFeature','synchronizedAudioText'));
			setONIXCheckbox('20');
		}
		
		_loadMessages.inferred = user_message.hasChildNodes() ? user_message : '';
	
	}
	
	
	/* generic function that just clicks whatever checkbox is passed in */
	function setCheckbox(property, meta_id) {
		document.querySelector('input[type="checkbox"][value="' + meta_id + '"]').click();
		var li = document.createElement('li');
			li.appendChild(document.createTextNode(property + ': ' + meta_id));
		return li;
	}
	
	
	/* onix IDs are prefixed, so appends the prefix as part of clicking the checkbox */
	function setONIXCheckbox(onix_id) {
		document.getElementById('onix' + onix_id).click();
	}
	
	
	/* check of a mode within an accessModeSufficient fieldset */
	function setSufficientMode(set_id, meta_id) {
		document.querySelector('fieldset#set' + set_id + ' input[type="checkbox"][value="' + meta_id + '"]').click();
	}
	
	
	/* 
	 * disables categories of success criteria depending on what they test for
	 * and whether that content is present in the epub
	 */
	function configureReporting() {
		
		if (!_aceReport.hasOwnProperty('data')) {
			return;
		}
		
		var alert_list = document.createElement('ul');
		
		setSuccessCriteriaStatus();
		
		var content_types = {
								img: {property: 'images', description: 'images'},
								script: {property: 'scripts', description: 'scripting'},
								audio: {property: 'audios', description: 'audio'},
								video: {property: 'videos', description: 'video'}
							};
		
		for (var id in content_types) {
			if (excludeContentChecks(id, content_types[id].property)) {
				var li = document.createElement('li');
					li.appendChild(document.createTextNode(content_types[id].description))
				alert_list.appendChild(li);
			}
		}
		
		if (!_aceReport['properties']['hasPageBreaks']) {
			document.querySelector('input[name="eg-1"][value="na"]').click();
			var li = document.createElement('li');
				li.appendChild(document.createTextNode('page breaks'))
			alert_list.appendChild(li);
		}
		
		if (!_aceReport['earl:testSubject']['metadata'].hasOwnProperty('media:duration')) {
			document.querySelector('input[name="eg-2"][value="na"]').click();
			var li = document.createElement('li');
				li.appendChild(document.createTextNode('media overlays'))
			alert_list.appendChild(li);
		}
		
		setEPUBFeatureWarnings();
		
		_loadMessages.reporting = alert_list.hasChildNodes() ? alert_list : '';
	}
	
	
	// analyzes the assertions in the ace report and sets the correspoding success criteria status
	function setSuccessCriteriaStatus() {
		
		if (_aceReport['earl:result']['earl:outcome'] == 'pass') {
			setSCStatus('sc-3.1.1','pass'); // lang
		}
		
		else {
			if (!_aceReport.hasOwnProperty('assertions')) {
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
	
	
	/* generic function to check the applicable status field within a success criterion */
	function setSCStatus(id, status, msg) {
		document.querySelector('input[name="'+id+'"][value="' + status + '"]').click();
		if (status == 'fail') {
			document.querySelector('textarea[id="'+id+'-err"]').value += msg + '\n';
		}
	}
	
	
	/*
	 * extracts all the ace assertions (failures) into a simpler to manage form
	 */
	function compileAssertions() {
		
		var ace_failures = {};
		
		for (var i = 0; i < _aceReport.assertions.length; i++) {
			
			if (!_aceReport.assertions[i].hasOwnProperty('assertions')) { 
				console.log('Document assertions has no sub-assertions');
				continue;
			}
			
			for (var j = 0; j < _aceReport.assertions[i].assertions.length; j++) {
				
				if (!_aceReport.assertions[i].assertions[j].hasOwnProperty('earl:test')) {
					console.log('Document assertions does not have an earl:test section');
					continue;
				}
				
				if (!_aceReport.assertions[i].assertions[j]['earl:test'].hasOwnProperty('dct:title')) {
					console.log('Assertion test has no title');
					continue;
				}
				
				if (!ace_failures.hasOwnProperty(_aceReport.assertions[i].assertions[j]['earl:test']['dct:title'])) {
					ace_failures[_aceReport.assertions[i].assertions[j]['earl:test']['dct:title']] = '';
				}
				
				// simplifies the ace structure so the assertion code is the key and a pared-down error message is the value
				ace_failures[_aceReport.assertions[i].assertions[j]['earl:test']['dct:title']] += _aceReport.assertions[i].assertions[j]['earl:result']['dct:description'].replace(/Fix (any|all) of the following:\s+/i,'') + ' (' + _aceReport.assertions[i]['earl:testSubject'].url + ').\n';
			}
		}
		
		return ace_failures;
	}
	
	
	/* 
	 * generic function that sets content checks (audio, video, images, etc.) to n/a if no matching content in the publication
	 */
	
	function excludeContentChecks(id, property) {
		
		// get the checkbox in the exclusions list for the specified id
		var test_checkbox = document.querySelector('#exclusions input[value="' + id + '"]');
		
		if (!_aceReport['data'].hasOwnProperty(property)) {
			if (!test_checkbox.checked) {
				// check to make the applicable success criteria n/a
				// clicking the checkbox calls smartConformance.changeContentConformance to modify the form
				test_checkbox.click();
			}
			return true;
		}
		
		else {
			if (test_checkbox.checked) {
				// uncheck to reset the success criteria to unverified
				test_checkbox.click();
			}
			return false;
		}
	}
	
	
	// appends the list of images and alt texts to the corresponding requirement in sc 1.1.1
	function setImageStatus(options) {
	
		var sc_111_listitem = document.getElementById(options.id);
		
		var leadin = document.createElement('p');
			leadin.appendChild(document.createTextNode(options.leadin));
		
		sc_111_listitem.appendChild(leadin);
		
		var image_list = document.createElement('ul');
		
		for (var i = 0; i < options.images.length; i++) {
			
			var image_item = document.createElement('li');
			
			var code = document.createElement('code');
				code.appendChild(document.createTextNode(options.images[i]));
			
			image_item.appendChild(code);
			image_list.appendChild(image_item);
		}
		
		sc_111_listitem.appendChild(image_list);
	}
	
	
	/* 
	 * inspects the ace report to see if any epub-specific features have been included in the publication
	 * and, if so, sets the warning in the conformance tab to alert the user to their presence
	 */
	function setEPUBFeatureWarnings() {
		
		// checks for: manifest fallbacks, bindings, epub:switch, and epub:trigger
		var features = {'manifest': 'hasManifestFallbacks', 'bindings': 'hasBindings', 'epub-switch': 'epub-switches', 'epub-trigger': 'epub-triggers'};
		var warningIsVisible = false;
		
		for (var key in features) {
			
			// if bindings or manifest fallbacks are present, they are set to true in the properties section - switches and triggers get listed under the data section
			if  ((_aceReport['properties'].hasOwnProperty(features[key]) && _aceReport['properties'][features[key]]) || _aceReport['data'].hasOwnProperty(features[key])) {
				
				var messages = document.getElementsByClassName(key);
				
				for (var i = 0; i < messages.length; i++) {
					messages[i].classList.add('listitem');
				}
				
				if (!warningIsVisible) {
					document.getElementById('fallbacks').classList.remove('hidden');
					document.getElementById('fallbacks').classList.add('visible');
					warningIsVisible = true;
				}
			}
		}
	}
	
	
	/* 
	 * generates the inforation to display in the pop-up dialog that appears 
	 * after the ace report import is finished
	 */
	function showReportLoadResult() {
		var import_result = document.getElementById('import');
		
		var successful_load = document.createElement('p');
			successful_load.appendChild(document.createTextNode('Ace report successfully imported!'));
		import_result.appendChild(successful_load);
		
		// alert user to any content checks that have been set to n/a
		
		if (_loadMessages.reporting.hasChildNodes()) {
			var report_exclusions = document.createElement('p');
				report_exclusions.appendChild(document.createTextNode('The following content types were not found in the publication:'));
			import_result.appendChild(report_exclusions);
			
			import_result.appendChild(_loadMessages.reporting);
			
			var exclusions_info = document.createElement('p');
				exclusions_info.appendChild(document.createTextNode('Checks related to them have been turned off. To re-enable these checks, see the Conformance Verification tab.'));
			import_result.appendChild(exclusions_info);
		}
		
		// alert the user to any discovery metadata that was inferred from the ace report
		
		if (_loadMessages.inferred) {
			var inferred_metadata = document.createElement('p');
				inferred_metadata.appendChild(document.createTextNode('The following accessibiity metadata was set based on the Ace report:'));
			import_result.appendChild(inferred_metadata);
			
			import_result.appendChild(_loadMessages.inferred);
			
			var verify_inferred = document.createElement('p');
				verify_inferred.appendChild(document.createTextNode('Verify the accuracy of these assumptions in the Discovery Metadata tab.'));
			import_result.appendChild(verify_inferred);
		}
		
		// alert the user if there are accessibility features that don't match any of the known/accepted values
		
		if (_loadMessages.features.length > 0) {
			var feature_metadata = document.createElement('p');
				feature_metadata.appendChild(document.createTextNode('The following accessibiity features were found in the metadata but do not match known values:'));
			import_result.appendChild(feature_metadata);
			
			var feature_ul = document.createElement('ul');
			
			_loadMessages.features.forEach(function(feature) {
				var feature_li = document.createElement('li');
					feature_li.appendChild(document.createTextNode(feature));
				feature_ul.appendChild(feature_li);
			});
			
			import_result.appendChild(feature_ul);
			
			var verify_features = document.createElement('p');
				verify_features.appendChild(document.createTextNode('Verify these features are not typos or invalid.'));
			import_result.appendChild(verify_features);
		}
		
		import_dialog.dialog('open');
	}

	
	return {
		storeReportJSON: function(json) {
			_aceReport = json;
		},
		
		loadAceReport: function() {
			loadAceReport();
		}
	}

})();
