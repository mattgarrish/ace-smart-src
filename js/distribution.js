
'use strict';

/* 
 * 
 * smartDistribution
 * 
 * Validates and generates ONIX accessibility metadata
 * 
 * Public functions:
 * 
 * - generateONIXMetadata - checks validity and generates tags for use in an ONIX record 
 * 
 */

var onix_dialog;

var smartDistribution = (function() {
	
	/* checks for inconsistencies in the metadata and that URLs are formatted correctly  */
	function validateONIXMetadata() {
		
		smartError.clearAll('distribution');
		
		var is_valid = true;
		
		/* check that the publication is not marked as conforming to the epub spec and also inaccessible */
		if ((document.getElementById('onix01').checked || document.getElementById('onix02').checked || document.getElementById('onix03').checked) && document.getElementById('onix09').checked) {
			smartError.logError({tab_id: 'distribution', element_id: 'onix09', severity: 'err', message: 'Publication cannot be marked both as conforming to accessibility standard(s) and as inaccessible.'});
			smartFormat.setFieldToError({id: 'onix09', is_warning: false, highlight_parent: true});
			is_valid = false;
		} 
		
		/* check that the publication is not marked as conforming to multiple levels of wcag */
		if (document.getElementById('onix02').checked || document.getElementById('onix03').checked) {
			smartError.logError({tab_id: 'distribution', element_id: 'onix02', severity: 'err', message: 'Publication cannot be marked both as conforming to both Level A and AA of the EPUB Accessibility specification.'});
			smartFormat.setFieldToError({id: 'onix02', is_warning: false, highlight_parent: true});
			is_valid = false;
		} 
		
		/* check that any URLs begin with http(s):// */
		for (var i = 94; i < 97; i++) {
			var url = document.getElementById('onix'+i).value;
			if (url) {
				if (!url.match(/^https?:\/\//i)) {
					smartError.logError({tab_id: 'distribution', element_id: 'onix'+i, severity: 'err', message: 'ONIX Field ' + i + ' must be a URL that starts with http:// or https://'});
					smartFormat.setFieldToError({id: 'onix'+i, is_warning: false, highlight_parent: true});
					is_valid = false;
				}
			}
		}
		
		return is_valid;
	}
	
	function generateONIXMetadata() {
	
		if (!validateONIXMetadata()) {
			if (!confirm('Metadata does not validate!\n\nClick Ok to generate anyway or Cancel to close this dialog and correct.')) {
				return;
			}
		}
		
		var onix_metadata = '';
		
		/*  add summary */
		var a11y_summary = document.getElementById('onix00').value.trim();
		
		if (a11y_summary) {
			onix_metadata += formatONIXEntry( {value: '00', description: a11y_summary } );
		}
		
		/* add any checked fields */
		for (var i = 1; i < 25; i++) {
			var onix_id = (i < 10 ? '0'+String(i) : i);
			var checkbox = document.getElementById('onix'+onix_id);
			
			if (checkbox && checkbox.checked) {
				onix_metadata += formatONIXEntry( {value: onix_id } );
			}
		}
		
		/* add any text input fields */
		for (var i = 94; i < 100; i++) {
			var data_field = document.getElementById('onix'+i).value.trim();
			if (data_field) {
				onix_metadata += formatONIXEntry( {value: i, description: data_field } );
			}
		}
		
		if (!onix_metadata) {
			alert('No metadata specified. Failed to generate.');
		}
		
		else {
			document.getElementById('distribution-metadata').value = '<descriptiveDetail>\n' + onix_metadata + '</descriptiveDetail>';
			if (onix_dialog) {
				onix_dialog.dialog('open');
			}
		}
	}
	
	/* adds the general tagging wrapper for the accessibility metadata fields */
	function formatONIXEntry(options) {
		var feature = '\t<productFormFeature>\n';
			feature += '\t\t<productFormFeatureType>09</producFormFeatureType>\n';
			feature += '\t\t<productFormFeatureValue>' + options.value + '</productFormFeatureValue>\n';
			
			if (options.hasOwnProperty('description')) {
				feature += '\t\t<productFormFeatureDescription>' + options.description + '<productFormFeatureDescription>\n';
			}
			
			feature += '\t</productFormFeature>\n';
		
		return feature;
	}
	
	return {
		generateONIXMetadata: function() {
			generateONIXMetadata();
		}
	}

})();
