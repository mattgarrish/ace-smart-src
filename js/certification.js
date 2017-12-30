
'use strict';

var smartCertification = (function(smartFormat) {
	
	function validate(options) {
		
		if (!options.quiet) {
			smartError.clearAll('certification');
		}
		
		var cert_elem = document.getElementById('certifiedBy');
		var certifier = cert_elem.value.trim();
		
		if (certifier == '') {
			smartError.logError({tab_id: 'certification', element_id: 'certifiedBy', severity: 'err', message: 'Certifier name is a required field.'});
			cert_elem.setAttribute('aria-invalid',true);
			cert_elem.parentNode.classList.add(smartFormat.BG.ERR);
			
			if (options.quiet) {
				return false;
			}
			else {
				if (!confirm('Metadata failed validation.\n\nClick Ok to generate anyway, or Cancel to review errors.')) {
					return false;
				}
			}
		}
		
		else {
			cert_elem.parentNode.classList.remove(smartFormat.BG.ERR);
		}
		
		var links = { 'certifierReport': 'Report link', 'credentialLink': 'Credential link' }
		
		for (var id in links) {
			var link_elem = document.getElementById(id);
			var linkText = link_elem.value.trim();
			
			if (linkText != '' && !linkText.match(/^https?:\/\//i)) {
				smartError.logError({tab_id: 'certification', element_id: id, severity: 'err', message: links[id]+' must begin with http:// or https://'});
				link_elem.setAttribute('aria-invalid',true);
				link_elem.parentNode.classList.add(smartFormat.BG.ERR);
			}
			else {
				link_elem.parentNode.classList.remove(smartFormat.BG.ERR);
			}
		}
		
		return true;
	}
	
	
	function generateCertificationMeta() {
		
		if (!validate()) {
			return;
		}
		
		var conf_str = 'http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-' + smartWCAG.WCAGLevel;
		var meta = '';
		
		if (!document.getElementById('conf-result').value == "fail") {
			meta = smartFormat.createMetaTag({type: 'link', property: 'dcterms:conformsTo', value: conf_str});
		}
		
		meta += smartFormat.createMetaTag({type: 'meta', property: 'a11y:certifiedBy', value: document.getElementById('certifiedBy').value.trim()});
		meta += smartFormat.createMetaTag({type: 'link', property: 'a11y:certifierReport', value: document.getElementById('certifierReport').value});
		
		var credNum = document.querySelectorAll('fieldset.credential').length;
		
		//for (var i = 1; i <= credNum; i++) {
			meta += smartFormat.createMetaTag({type: 'meta', property: 'a11y:certifierCredential', value: document.getElementById('credentialName').value});
			meta += smartFormat.createMetaTag({type: 'link', property: 'a11y:certifierCredential', value: document.getElementById('credentialLink').value});
		//}
		
		document.getElementById('conf-meta').value = meta;
	}
	
	
	function addCredential() {
	
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
	
	return {
		generateCertificationMeta: function() {
			generateCertificationMeta();
		},
		validate: function(options) {
			options = typeof(options) === 'object' ? options : {};
			options.quiet = options.hasOwnProperty('quiet') ? options.quiet : false;
			validate(options);
		}
	}

})(smartFormat);
