
'use strict';

/* 
 * 
 * smartCertification
 * 
 * Verifies and outputs certification metadata
 * 
 * Public functions
 * 
 * - validate - verifies required certification metadata is present and checks format of links
 * 
 * - generateConformanceMetadata - generate package document metadata tags from certifier information 
 * 
 */

var smartCertification = (function() {
	
	function validateCertificationMetadata(clear) {
		
		if (clear) {
			smartError.clearAll('certification');
		}
		
		var is_valid = true;
		
		if (document.getElementById('certifiedBy').value.trim() == '') {
			smartError.logError({tab_id: 'certification', element_id: 'certifiedBy', severity: 'err', message: 'Certifier name is a required field.'});
			smartFormat.setFieldToError({id: 'certifiedBy', is_warnign: true, highlight_parent: true});
			is_valid = false;
		}
		
		else {
			smartFormat.setFieldToPass({id: 'certifiedBy', highlight_parent: true});
		}
		
		var links = { 'certifierReport': 'Report link', 'certifierCredential': 'Credential link' }
		
		for (var id in links) {
		
			var link_value = document.getElementById(id).value.trim();
			
			if (link_value && !link_value.match(/^https?:\/\//i)) {
				smartError.logError({tab_id: 'certification', element_id: id, severity: 'warn', message: links[id]+' should begin with http:// or https://'});
				smartFormat.setFieldToError({id: id, is_warning: true, highlight_parent: true});
				is_valid = false;
			}
			
			else {
				smartFormat.setFieldToPass({id: id, highlight_parent: true});
			}
		}
		
		return is_valid;
	}
	
	
	function generateCertificationMetadata() {
		
		if (!validateCertificationMetadata()) {
			if (!confirm('Metadata failed validation.\n\nClick Ok to generate, or Cancel to review errors.')) {
				return;
			}
		}
		
		var conformance_url = 'http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-' + smartWCAG.WCAGLevel();
		
		var metadata = '';
		
		if (!document.getElementById('conformance-result').value == "fail") {
			metadata += smartFormat.createMetaTag({type: 'link', property: 'dcterms:conformsTo', value: conformance_url});
		}
		
		metadata += smartFormat.createMetaTag({type: 'meta', property: 'a11y:certifiedBy', value: document.getElementById('certifiedBy').value.trim()});
		metadata += smartFormat.createMetaTag({type: 'link', property: 'a11y:certifierReport', value: document.getElementById('certifierReport').value});
		metadata += smartFormat.createMetaTag({type: 'link', property: 'a11y:certifierCredential', value: document.getElementById('certifierCredential').value});
		
		if (metadata == '') {
			alert('No metadata specified. Failed to generate.');
		}
		
		else {
			document.getElementById('certification-metadata').value = metadata;
			certification_dialog.dialog('open');
		}
	}
	
	return {
		validateCertificationMetadata: function() {
			validateCertificationMetadata(false);
		},
		
		generateCertificationMetadata: function() {
			generateCertificationMetadata();
		}
	}

})();
