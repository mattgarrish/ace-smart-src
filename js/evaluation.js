
'use strict';

/* 
 * 
 * smartEvaluation
 * 
 * Verifies and outputs evaluation metadata
 * 
 * Public functions
 * 
 * - validate - verifies required evaluation metadata is present and checks format of links
 * 
 * - generateConformanceMetadata - generate package document metadata tags from evaluator information 
 * 
 */

var evaluation_dialog;

var smartEvaluation = (function() {
	
	function validateEvaluationMetadata(clear) {
		
		if (clear) {
			smartError.clearAll('evaluation');
		}
		
		var is_valid = true;
		
		if (document.getElementById('certifiedBy').value.trim() == '') {
			smartError.logError({tab_id: 'evaluation', element_id: 'certifiedBy', severity: 'err', message: 'Evaluator name is a required field.'});
			smartFormat.setFieldToError({id: 'certifiedBy', is_warnign: true, highlight_parent: true});
			is_valid = false;
		}
		
		else {
			smartFormat.setFieldToPass({id: 'certifiedBy', highlight_parent: true});
		}
		
		var links = { 'certifierReport': 'Report link' }
		
		for (var id in links) {
		
			var link_value = document.getElementById(id).value.trim();
			
			if (link_value && !link_value.match(/^https?:\/\//i)) {
				smartError.logError({tab_id: 'evaluation', element_id: id, severity: 'warn', message: links[id]+' should begin with http:// or https://'});
				smartFormat.setFieldToError({id: id, is_warning: true, highlight_parent: true});
				is_valid = false;
			}
			
			else {
				smartFormat.setFieldToPass({id: id, highlight_parent: true});
			}
		}
		
		return is_valid;
	}
	
	
	function generateEvaluationMetadata() {
		
		if (!validateEvaluationMetadata()) {
			if (!confirm('Metadata failed validation.\n\nClick Ok to generate, or Cancel to review errors.')) {
				return;
			}
		}
		
		var conformance_url = 'http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-' + smartWCAG.WCAGLevel();
		
		var metadata = '';
		
		var conformance_result = document.getElementById('conformance-result');
		
		if (conformance_result && !conformance_result.value == "fail") {
			metadata += smartFormat.createMetaTag({type: 'link', property: 'dcterms:conformsTo', value: conformance_url});
		}
		
		metadata += smartFormat.createMetaTag({type: 'meta', property: 'a11y:certifiedBy', value: document.getElementById('certifiedBy').value.trim()});
		metadata += smartFormat.createMetaTag({type: 'link', property: 'a11y:certifierReport', value: document.getElementById('certifierReport').value});
		
		if (metadata == '') {
			alert('No metadata specified. Failed to generate.');
		}
		
		else {
			document.getElementById('evaluation-metadata').value = metadata;
			if (evaluation_dialog) {
				evaluation_dialog.dialog('open');
			}
		}
	}
	
	return {
		validateEvaluationMetadata: function() {
			validateEvaluationMetadata(false);
		},
		
		generateEvaluationMetadata: function() {
			generateEvaluationMetadata();
		}
	}

})();