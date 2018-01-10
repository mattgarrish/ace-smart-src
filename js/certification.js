
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

var smartCertification = (function(smartFormat) {
	
	function validateCertificationMetadata() {
		
		smartError.clearAll('certification');
		
		var is_valid = true;
		
		if (document.getElementById('certifiedBy').value.trim() == '') {
			smartError.logError({tab_id: 'certification', element_id: 'certifiedBy', severity: 'err', message: 'Certifier name is a required field.'});
			smartFormat.setFieldToError('certifiedBy', true, true);
			is_valid = false;
		}
		
		else {
			smartFormat.setFieldToPass('certifiedBy', true);
		}
		
		var links = { 'certifierReport': 'Report link', 'certifierCredential': 'Credential link' }
		
		for (var id in links) {
		
			if (!document.getElementById(id).value.trim().match(/^https?:\/\//i)) {
				smartError.logError({tab_id: 'certification', element_id: id, severity: 'err', message: links[id]+' must begin with http:// or https://'});
				smartFormat.setFieldToError(id, true, true);
				is_valid = false;
			}
			
			else {
				smartFormat.setFieldToPass(id, true);
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
		
		var conformance_url = 'http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-' + smartWCAG.WCAGLevel;
		
		var metadata = '';
		
		if (!document.getElementById('conf-result').value == "fail") {
			metadata += smartFormat.createMetaTag({type: 'link', property: 'dcterms:conformsTo', value: conformance_url});
		}
		
		metadata += smartFormat.createMetaTag({type: 'meta', property: 'a11y:certifiedBy', value: document.getElementById('certifiedBy').value.trim()});
		metadata += smartFormat.createMetaTag({type: 'link', property: 'a11y:certifierReport', value: document.getElementById('certifierReport').value});
		metadata += smartFormat.createMetaTag({type: 'link', property: 'a11y:certifierCredential', value: document.getElementById('certifierCredential').value});
		
		document.getElementById('certification-metadata').value = metadata;
	}
	
	return {
		validateCertificationMetadata: function() {
			validateCertificationMetadata();
		},
		
		generateCertificationMetadata: function() {
			generateCertificationMetadata();
		}
	}

})(smartFormat);
