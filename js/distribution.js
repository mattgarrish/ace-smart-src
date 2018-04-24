
'use strict';

/* 
 * 
 * smartDistribution
 * 
 * 
 */

var onix_dialog;

var smartDistribution = (function() {
	
	function validateONIXMetadata() {
		
		var is_valid = true;
		
		if (document.querySelector('input[name="onix-chkbox"][value="01"]:checked') && document.querySelector('input[name="onix-chkbox"][value="09"]:checked')) {
			alert('Publication cannot be both LIA compliant and inaccessible.');
			is_valid = false;
		} 
		
		for (var i = 94; i < 97; i++) {
			var url = document.getElementById('onix'+i).value;
			if (url) {
				if (!url.match(/^https?:\/\//i)) {
					alert('ONIX Field ' + i + ' must be a URL that starts with http:// or https://');
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
		
		var a11y_summary = document.getElementById('onix00').value.trim();
		
		if (a11y_summary) {
			onix_metadata += formatONIXEntry( {value: '00', description: a11y_summary } );
		}
		
		var checked_onix_fields = document.querySelectorAll('input[name="onix-chkbox"]:checked');
		
		if (checked_onix_fields) {
			for (var i = 0; i < checked_onix_fields.length; i++) {
				onix_metadata += formatONIXEntry( {value: checked_onix_fields[i].value } );
			}
		}
		
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
