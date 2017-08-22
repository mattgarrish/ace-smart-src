
var disc = new Discovery();

function Discovery() { 

		this.error = { "accessibilityFeature": {}, "accessibilityHazard": {}, "accessMode": {}, "accessibilitySummary": {}, "accessModeSufficient": {} };
		this.error.accessModeSufficient = { "missing": {}, "none": {}, "dup": {} };
			 
		this.error.accessibilityFeature.msg = 'At least one accessibility feature must be specified.';
		this.error.accessibilityFeature.warn = false;
			 
		this.error.accessibilityHazard.msg = 'A hazard indication is required. If uncertain whether there are hazards in the content, select the "unknown" value.';
		this.error.accessibilityHazard.warn = false;
			 
		this.error.accessMode.msg = 'At least one access mode must be selected.';
		this.error.accessMode.warn = false;
			 
		this.error.accessibilitySummary.msg = 'An accessibility summary is required. The summary must not be empty or contain only white space.';
		this.error.accessibilitySummary.warn = false;
			 
		this.error.accessModeSufficient.missing.msg = 'Sufficient access mode "%%val%%" checked but is not listed as an access mode. It is not common for a publication to have a sufficient access mode that is not also an access mode.';
		this.error.accessModeSufficient.missing.warn = true;
			 
		this.error.accessModeSufficient.none.msg = 'Sufficient access modes for reading the publication not specified.';
		this.error.accessModeSufficient.none.warn = true;
 
		this.error.accessModeSufficient.dup.msg = 'Duplicate sets of sufficient access modes specified.';
		this.error.accessModeSufficient.dup.warn = false;
}




Discovery.prototype.validate = function(quiet) {

	if (!quiet) {
		error.clearAll('discovery');
	}
	
	var msg = { 'err': false, 'warn': false };
	
	this.verifyOneCheck('accessibilityFeature',msg);
	
	if (document.getElementById('accessibilitySummary').value.replace(/\s/g,'') == '') {
		error.write('discovery','summary-field','err',this.error['accessibilitySummary'].msg);
		this.highlightError('summary-field', this.error['accessibilitySummary'].warn);
		msg.err = true;
	}
	
	else {
		this.setPass('summary-field');
	}
	
	this.verifyOneCheck('accessibilityHazard',msg);
	
	this.verifyOneCheck('accessMode',msg);
	
	this.verifySufficient(msg);
	
	// optional metadata gets an automatic pass
	this.setPass('accessibilityAPI');
	this.setPass('accessibilityControl');
	
	if (quiet) {
		return (msg.err || msg.warn) ? false : true;
	}
	
	if (msg.err || msg.warn) {
		if (!confirm('Metadata does not validate!\n\nClick Ok to generate anyway or Cancel to close this dialog and correct.')) {
			return;
		}
	}
	
	this.generateMetadata();
}

Discovery.prototype.highlightError = function(id,isWarning) {
	var fDiv = document.getElementById(id);
		fDiv.setAttribute('aria-invalid', (isWarning ? false : true));
		fDiv.classList.add(isWarning ? format.BG.WARN : format.BG.ERR);
}

Discovery.prototype.setPass = function(id) {
	document.getElementById(id).classList.add(format.BG.PASS);
}

Discovery.prototype.verifyOneCheck = function(id,msg) {
	var elemList = document.querySelectorAll('fieldset#' + id + ' input:checked')
	
	if (elemList.length > 0) {
		this.setPass(id);
		return;
	}
	
	msg.err = true;
	
	console.log(id);
	error.write('discovery',id,'err',this.error[id].msg);
	
	this.highlightError(id, this.error[id].warn);
}

Discovery.prototype.verifySufficient = function(msg) {
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
				error.write('discovery','accessModeSufficient','warn',this.error.accessModeSufficient.missing.msg.replace('%%val%%', modes[j].value));
				this.highlightError('accessModeSufficient', this.error.accessModeSufficient.missing.warn);
				return;
			}
		}
		
		if (thisList != '') {
			modeList.push(thisList);
		}
	}

	if (modeList.length == 0) {
		msg.warn = true;
		error.write('discovery','accessModeSufficient','warn',this.error.accessModeSufficient.none.msg);
		this.highlightError('accessModeSufficient', this.error.accessModeSufficient.none.warn);
		return;
	}
	
	// check no duplicates
	modeList.sort();
	for (var k = 1; k < modeList.length; k++) {
		if (modeList[k] == modeList[k-1]) {
			msg.err = true;
			error.write('discovery','accessModeSufficient','err',this.error.accessModeSufficient.dup.msg);
			this.highlightError('accessModeSufficient', this.error.accessModeSufficient.dup.warn);
			return;
		}
	}
	
	this.setPass('accessModeSufficient');
	
	return;
}

Discovery.prototype.generateMetadata = function() {

	var output = '';
	var outputBox = document.getElementById('metadata');
	
	outputBox.value = '';
	
	// add accessibility features
	output += this.addMeta('schema:accessibilityFeature', 'accessibilityFeature');
	
	// add the summary
	output += this.addSummary('schema:accessibilitySummary', 'accessibilitySummary');
	
	// add hazards
	output += this.addMeta('schema:accessibilityHazard', 'accessibilityHazard');
	
	// add access modes
	output += this.addMeta('schema:accessMode', 'accessMode');
	
	// add sufficent access modes
	output += this.addSufficientSets('schema:accessModeSufficient');
	
	// add apis
	output += this.addMeta('schema:accessibilityAPI', 'accessibilityAPI');
	
	// add controls
	output += this.addMeta('schema:accessibilityControl', 'accessibilityControl');
	
	if (output == '') {
		alert('No metadata specified. Failed to generate.');
	}
	
	else {
		outputBox.value = output;
	}

}

Discovery.prototype.addMeta = function(property, id) {
	var elemList = document.getElementById(id).getElementsByTagName('input');
	var meta = '';
	for (var i = 0; i < elemList.length; i++) {
		if (elemList[i].checked) {
			meta += format.metaTag(true, property, elemList[i].value);
		}
	}
	return meta;
}

Discovery.prototype.addSummary = function(property, id) {
	var summary = document.getElementById(id).value;
	if (format.epub_version == 3) {
		// replace & < and > for use as element text
		summary.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
	}
	else {
		// replace & " < > and line endings for use as attribute text
		summary.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\r?\n/g, ' ')
	}
	return format.metaTag(true, property, summary);
}

Discovery.prototype.addSufficientSets = function(property) {
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
			meta += format.metaTag(true, property, modeList);
		}
	}
	return meta;
}

Discovery.prototype.addCustomFeature = function(fname) {
	
	if (fname == null || fname == '') {
		fname = prompt('Enter the accessibility feature as it will appear in the metadata:').trim();
	}
	
	if (fname != '') {
		if (document.getElementById(fname)) {
			alert('Feature already exists. Unable to add');
		}
		else {
			var addLink = document.getElementById('add-af');
			var parentField = addLink.parentNode;
			
			var newEntry = document.createElement("label");
				newEntry.setAttribute("class", "custom");
			
			var newCheckbox = document.createElement("input");
				newCheckbox.setAttribute("type", "checkbox");
				newCheckbox.setAttribute("value", fname);
				newCheckbox.setAttribute("checked", "checked");
			
			newEntry.appendChild(newCheckbox);
			
			newEntry.appendChild(document.createTextNode(" "+fname));
			
			parentField.insertBefore(newEntry, addLink);
		}
	}
	
	else {
		alert('Invalid feature value. Values must be at least one character in length.');
	}
}

Discovery.prototype.addSufficient = function() {

	var num = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset').length + 1;
	
	var addLink = document.getElementById('add-ams');
	var parentField = addLink.parentNode;
	
	var newField = document.createElement("fieldset");
	newField.setAttribute("id", "set"+num);
	newField.setAttribute("class", "custom");
	
	var legend = document.createElement("legend");
	legend.appendChild(document.createTextNode("Set "+num));
	newField.appendChild(legend);
	
	var fields = ['auditory','tactile','textual','visual'];
	
	for (var i = 0; i < fields.length; i++) {
		var newLabel = document.createElement("label");
		var newCheckbox = document.createElement("input");
		newCheckbox.setAttribute("type", "checkbox");
		newCheckbox.setAttribute("value",fields[i]);
		newLabel.appendChild(newCheckbox);
		
		var labelText = document.createTextNode(" "+fields[i]);
		newLabel.appendChild(labelText);
		
		newField.appendChild(newLabel);
	}
	
	parentField.insertBefore(newField, addLink);
}
