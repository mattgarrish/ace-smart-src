
'use strict';

/* 
 * 
 * smartEvaluation
 * 
 * Verifies and outputs evaluation metadata
 * 
 * Public functions
 * 
 * - validateEvaluationMetadata - verifies required evaluation metadata is present and checks format of links
 * 
 * - generateEvaluationMetadata - generate package document metadata tags from evaluator information 
 * 
 */

var evaluation_dialog;

var smartEvaluation = (function() {
	
	/* checks the evaluator name the report link */
	function validateEvaluationMetadata(clear) {
		
		if (clear) {
			smartError.clearAll('evaluation');
		}
		
		var is_valid = true;
		
		// check that the certifier's name has been set
		if (document.getElementById('certifiedBy').value.trim() == '') {
			smartError.logError({tab_id: 'evaluation', element_id: 'certifiedBy', severity: 'err', message: 'Evaluator name is a required field.'});
			smartFormat.setFieldToError({id: 'certifiedBy', is_warnign: true, highlight_parent: true});
			is_valid = false;
		}
		
		else {
			smartFormat.setFieldToPass({id: 'certifiedBy', highlight_parent: true});
		}
		
		//check that tht certifier report link begins with http(s)://
		var links = { 'certifierReport': 'Report link' }
		
		for (var id in links) {
		
			var link_value = document.getElementById(id).value.trim();
			
			if (link_value != '' && !link_value.match(/^https?:\/\//i)) {
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
	
	
	/* generates the set of tags for use in the package document - dcterms:conformsTo, a11y:certifiedBy, a11y:certifierReport */
	function generateEvaluationMetadata() {
		
		if (!validateEvaluationMetadata()) {
			if (!confirm('Metadata failed validation.\n\nClick Ok to generate, or Cancel to review errors.')) {
				return;
			}
		}
		
		/* conformance URL needs to be updated each time there is a revision to the specification */
		var conformance_url = 'http://www.idpf.org/epub/a11y/accessibility-20170105.html#wcag-' + smartWCAG.WCAGLevel();
		
		var metadata = '';
		
		var conformance_result = document.getElementById('conformance-result');
		
		if (conformance_result && conformance_result.value != "fail") {
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
			return validateEvaluationMetadata(false);
		},
		
		generateEvaluationMetadata: function() {
			generateEvaluationMetadata();
		}
	}

})();
