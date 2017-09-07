
var conf_meta = new ConformanceMeta();

function ConformanceMeta() {
	this.addDaisyCredential = false;
}


ConformanceMeta.prototype.setDaisyCredential = function() {
	this.addDaisyCredential = true;
}

ConformanceMeta.prototype.validate = function(quiet) {
	
	if (!quiet) {
		error.clearAll('conformance');
	}
	
	var cert_elem = document.getElementById('certifier');
	var certifier = cert_elem.value.trim();
	
	if (certifier == '') {
		error.write('conformance','certifier','err','Certifier name is a required field.');
		cert_elem.setAttribute('aria-invalid',true);
		cert_elem.parentNode.classList.add(format.BG.ERR);
		
		if (quiet) {
			return false;
		}
		else {
			if (!confirm('Metadata failed validation.\n\nClick Ok to generate anyway, or Cancel to review errors.')) {
				return false;
			}
		}
	}
	
	else {
		cert_elem.parentNode.classList.remove(format.BG.ERR);
	}
	
	return true;
}


ConformanceMeta.prototype.generateConformanceMeta = function() {
	
	if (!this.validate()) {
		return;
	}
	
	var conf_str = 'http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-' + conf.wcag_level;
	var meta = '';
	
	if (!document.querySelector('input[name="conf-result"][value="fail"]').checked) {
		meta = format.metaTag(false,'dcterms:conformsTo',conf_str);
	}
	
	meta += format.metaTag(true,'a11y:certifiedBy',document.getElementById('certifier').value.trim());
	meta += format.metaTag(false,'a11y:certifierReport',document.getElementById('reportLink').value);
	
	if (this.addDaisyCredential) {
		meta += format.metaTag(true,'a11y:certifierCredential','http://www.daisy.org/ace/certified');
	}
	
	var credNum = document.querySelectorAll('fieldset.credential').length;
	
	for (var i = 1; i <= credNum; i++) {
		meta += format.metaTag(true,'a11y:certifierCredential',document.getElementById('credentialName'+i).value);
		meta += format.metaTag(false,'a11y:certifierCredential',document.getElementById('credentialLink'+i).value);
	}
	
	document.getElementById('conf-meta').value = meta;
}


ConformanceMeta.prototype.addCredential = function() {

	var num = document.querySelectorAll('fieldset.credential').length + 1;
	
	var credLink = document.getElementById('add-cred');
	var parentField = credLink.parentNode;
	
	var newField = document.createElement("fieldset");
	newField.setAttribute("class", "credential");
	
	var legend = document.createElement("legend");
	legend.appendChild(document.createTextNode("Credential:"));
	newField.appendChild(legend);
	
	var fields = ['Name','Link'];
	
	for (var i = 0; i < fields.length; i++) {
		var newLabel = document.createElement("label");
		newLabel.setAttribute("class","data");
		
		var newSpan = document.createElement("span");
		newSpan.appendChild(document.createTextNode(fields[i]+":"));
		
		newLabel.appendChild(newSpan);
		newLabel.appendChild(document.createTextNode(" "));
		
		var newInput = document.createElement("input");
		newInput.setAttribute("type", "text");
		newInput.setAttribute("id", "credential"+fields[i]+num);
		newLabel.appendChild(newInput);
		
		newField.appendChild(newLabel);
	}
	
	parentField.insertBefore(newField, credLink);

}

