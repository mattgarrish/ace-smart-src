
'use strict';

document.getElementById('discovery_button').onclick = function() {
	smartDiscovery.validate(false);
}

var smartDiscovery = (function(smartFormat) { 

	var _prop_error = { "accessibilityFeature": {}, "accessibilityHazard": {}, "accessMode": {}, "accessibilitySummary": {}, "accessModeSufficient": {} };
		_prop_error.accessModeSufficient = { "missing": {}, "none": {}, "dup": {} };
		
		_prop_error.accessibilityFeature.msg = 'At least one accessibility feature must be specified.';
		_prop_error.accessibilityFeature.warn = false;
		
		_prop_error.accessibilityHazard.msg = 'A hazard indication is required. If uncertain whether there are hazards in the content, select the "unknown" value.';
		_prop_error.accessibilityHazard.warn = false;
		
		_prop_error.accessMode.msg = 'At least one access mode must be selected.';
		_prop_error.accessMode.warn = false;
		
		_prop_error.accessibilitySummary.msg = 'An accessibility summary is required. The summary must not be empty or contain only white space.';
		_prop_error.accessibilitySummary.warn = false;
		
		_prop_error.accessModeSufficient.missing.msg = 'Sufficient access mode "%%val%%" checked but is not listed as an access mode. It is not common for a publication to have a sufficient access mode that is not also an access mode.';
		_prop_error.accessModeSufficient.missing.warn = true;
		 
		_prop_error.accessModeSufficient.none.msg = 'Sufficient access modes for reading the publication not specified.';
		_prop_error.accessModeSufficient.none.warn = true;

		_prop_error.accessModeSufficient.dup.msg = 'Duplicate sets of sufficient access modes specified.';
		_prop_error.accessModeSufficient.dup.warn = false;
	
	
	function validate(quiet) {
	
		if (!quiet) {
			smartError.clearAll('discovery');
		}
		
		var msg = { 'err': false, 'warn': false };
		
		verifyOneCheck('accessibilityFeature',msg);
		
		if (document.getElementById('accessibilitySummary').value.replace(/\s/g,'') == '') {
			smartError.logError({tab_id: 'discovery', element_id: 'summary-field', severity: 'err', message: _prop_error['accessibilitySummary'].msg});
			highlightError('summary-field', _prop_error['accessibilitySummary'].warn);
			msg.err = true;
		}
		
		else {
			setPass('summary-field');
		}
		
		verifyOneCheck('accessibilityHazard',msg);
		
		verifyOneCheck('accessMode',msg);
		
		verifySufficient(msg);
		
		// optional metadata gets an automatic pass
		setPass('accessibilityAPI');
		setPass('accessibilityControl');
		
		if (quiet) {
			return (msg.err || msg.warn) ? false : true;
		}
		
		if (msg.err || msg.warn) {
			if (!confirm('Metadata does not validate!\n\nClick Ok to generate anyway or Cancel to close this dialog and correct.')) {
				return;
			}
		}
		
		generateMetadata();
	}
	
	function highlightError(id,isWarning) {
		var fDiv = document.getElementById(id);
			fDiv.setAttribute('aria-invalid', (isWarning ? false : true));
			fDiv.classList.add(isWarning ? smartFormat.BG.WARN : smartFormat.BG.ERR);
	}
	
	function setPass(id) {
		document.getElementById(id).classList.add(smartFormat.BG.PASS);
	}
	
	function verifyOneCheck(id,msg) {
		var elemList = document.querySelectorAll('fieldset#' + id + ' input:checked')
		
		if (elemList.length > 0) {
			setPass(id);
			return;
		}
		
		msg.err = true;
		
		//console.log(id);
		smartError.logError({tab_id: 'discovery', element_id: id, severity: 'err', message: _prop_error[id].msg});
		
		highlightError(id, _prop_error[id].warn);
	}
	
	function verifySufficient(msg) {
		var sets = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset');
		var modeList = [];
		
		// check sufficient modes have been checked
		for (var i = 0; i < sets.length; i++) {
			var modes = sets[i].querySelectorAll('input:checked');
			var thisList = '';
			
			for (var j = 0; j < modes.length; j++) {
				thisList += modes[j].value;
				
				if (!document.querySelector('input[type="checkbox"][id="'+modes[j].value+'"]:checked')) {
					msg.warn = true;
					smartError.logError({tab_id: 'discovery', element_id: 'accessModeSufficient', severity: 'warn', message: _prop_error.accessModeSufficient.missing.msg.replace('%%val%%', modes[j].value)});
					highlightError('accessModeSufficient', _prop_error.accessModeSufficient.missing.warn);
					return;
				}
			}
			
			if (thisList != '') {
				modeList.push(thisList);
			}
		}
	
		if (modeList.length == 0) {
			msg.warn = true;
			smartError.logError({tab_id: 'discovery', element_id: 'accessModeSufficient', severity: 'warn', message: _prop_error.accessModeSufficient.none.msg});
			highlightError('accessModeSufficient', _prop_error.accessModeSufficient.none.warn);
			return;
		}
		
		// check no duplicates
		modeList.sort();
		for (var k = 1; k < modeList.length; k++) {
			if (modeList[k] == modeList[k-1]) {
				msg.err = true;
				smartError.logError({tab_id: 'discovery', element_id: 'accessModeSufficient', severity: 'err', message: _prop_error.accessModeSufficient.dup.msg});
				highlightError('accessModeSufficient', _prop_error.accessModeSufficient.dup.warn);
				return;
			}
		}
		
		setPass('accessModeSufficient');
		
		return;
	}
	
	function generateMetadata() {
	
		var output = '';
		var outputBox = document.getElementById('metadata');
		
		outputBox.value = '';
		
		// add accessibility features
		output += addMeta('schema:accessibilityFeature', 'accessibilityFeature');
		
		// add the summary
		output += addSummary('schema:accessibilitySummary', 'accessibilitySummary');
		
		// add hazards
		output += addMeta('schema:accessibilityHazard', 'accessibilityHazard');
		
		// add access modes
		output += addMeta('schema:accessMode', 'accessMode');
		
		// add sufficent access modes
		output += addSufficientSets('schema:accessModeSufficient');
		
		// add apis
		output += addMeta('schema:accessibilityAPI', 'accessibilityAPI');
		
		// add controls
		output += addMeta('schema:accessibilityControl', 'accessibilityControl');
		
		if (output == '') {
			alert('No metadata specified. Failed to generate.');
		}
		
		else {
			outputBox.value = output;
		}
	
	}
	
	function addMeta(property, id) {
		var elemList = document.getElementById(id).getElementsByTagName('input');
		var meta = '';
		for (var i = 0; i < elemList.length; i++) {
			if (elemList[i].checked) {
				meta += smartFormat.createMetaTag({type: 'meta', property: property, value: elemList[i].value});
			}
		}
		return meta;
	}
	
	function addSummary(property, id) {
		var summary = document.getElementById(id).value;
		if (smartFormat.epub_version == 3) {
			// replace & < and > for use as element text
			summary.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
		}
		else {
			// replace & " < > and line endings for use as attribute text
			summary.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\r?\n/g, ' ')
		}
		return smartFormat.createMetaTag({type: 'meta', property: property, value: summary});
	}
	
	function addSufficientSets(property) {
		var meta = '';
		var sets = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset');
		for (var i = 0; i < sets.length; i++) {
			var elemList = sets[i].querySelectorAll('input:checked');
			var modeList = '';
			for (var j = 0; j < elemList.length; j++) {
				if (modeList != '') { modeList += ','; }
				modeList += elemList[j].value;
			}
			if (modeList != '') {
				meta += smartFormat.createMetaTag({type: true, property: property, value: modeList});
			}
		}
		return meta;
	}
	
	function addCustomFeature(fname) {
		
		if (fname == null || fname == '') {
			fname = prompt('Enter the accessibility feature as it will appear in the metadata:').trim();
		}
		
		if (fname != '') {
			if (document.getElementById(fname)) {
				alert('Feature already exists. Unable to add');
			}
			else {
				var addLink = document.getElementById('add-af');
				var colDiv = addLink.parentNode.getElementsByClassName('cols')[0];
				
				var newEntry = document.createElement("label");
					newEntry.setAttribute("class", "custom");
				
				var newCheckbox = document.createElement("input");
					newCheckbox.setAttribute("type", "checkbox");
					newCheckbox.setAttribute("value", fname);
					newCheckbox.setAttribute("checked", "checked");
				
				newEntry.appendChild(newCheckbox);
				
				newEntry.appendChild(document.createTextNode(" "+fname));
				
				colDiv.appendChild(newEntry, addLink);
			}
		}
		
		else {
			alert('Invalid feature value. Values must be at least one character in length.');
		}
	}
	
	function addSufficient() {
	
		var num = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset').length + 1;
		
		var addLink = document.getElementById('add-ams');
		var parentField = addLink.parentNode;
		
		var newField = document.createElement("fieldset");
			newField.setAttribute("id", "set"+num);
			newField.setAttribute("class", "custom");
		
		var legend = document.createElement("legend");
			legend.appendChild(document.createTextNode("Set "+num));
		
		newField.appendChild(legend);
		
		var colDiv = document.createElement('div');
			colDiv.setAttribute('class','cols two');
		
		var fields = ['auditory','tactile','textual','visual'];
		
		for (var i = 0; i < fields.length; i++) {
			var newLabel = document.createElement("label");
			
			var newCheckbox = document.createElement("input");
				newCheckbox.setAttribute("type", "checkbox");
				newCheckbox.setAttribute("value",fields[i]);
			
			newLabel.appendChild(newCheckbox);
			
			var labelText = document.createTextNode(" "+fields[i]);
			
			newLabel.appendChild(labelText);
			
			colDiv.appendChild(newLabel);
		}
		
		newField.appendChild(colDiv);
		
		parentField.insertBefore(newField, addLink);
	}
	
	return {
		addCustomFeature: function(fname) {
			addCustomFeature(fname);
		},
		
		addSufficient: function() {
			addSufficient();
		},
		
		validate: function(quiet) {
			validate(quiet);
		}
	}

})(smartFormat);
