
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
			smartError.logError({tab_id: 'distribution', element_id: 'onix09', severity: 'err', message: smart_errors.validation.distribution.a11yConflict[smart_lang]});
			smartFormat.setFieldToError({id: 'onix09', is_warning: false, highlight_parent: true});
			is_valid = false;
		} 
		
		/* check that the publication is not marked as conforming to multiple levels of wcag */
		if (document.getElementById('onix02').checked && document.getElementById('onix03').checked) {
			smartError.logError({tab_id: 'distribution', element_id: 'onix02', severity: 'err', message: smart_errors.validation.distribution.a11yDuplication[smart_lang]});
			smartFormat.setFieldToError({id: 'onix02', is_warning: false, highlight_parent: true});
			is_valid = false;
		} 
		
		/* check that any URLs begin with http(s):// */
		for (var i = 94; i < 97; i++) {
			var url = document.getElementById('onix'+i).value;
			if (url) {
				if (!url.match(/^https?:\/\//i)) {
					smartError.logError({tab_id: 'distribution', element_id: 'onix'+i, severity: 'err', message: smart_errors.validation.distribution.nonURL.replace('%%val%%',i)});
					smartFormat.setFieldToError({id: 'onix'+i, is_warning: false, highlight_parent: true});
					is_valid = false;
				}
			}
		}
		
		return is_valid;
	}
	
	
	
	/* adds the distribution metadata fields to the form */
	function addDistributionMetadata() {
		
		var meta_fields = document.getElementById('distribution-fields');
		
		for (var i = 0; i < onix_meta.properties.length; i++) {
			
			var property = onix_meta.properties[i];
			
			var container = document.createElement(property.type == 'checkbox' ? 'fieldset' : 'div');
				container.setAttribute('class', 'onix');
			
			var label = document.createElement(property.type == 'checkbox' ? 'legend' : 'label');
			
			if (property.type != 'checkbox') {
				label.setAttribute('for', 'onix'+property.id);
				label.appendChild(document.createTextNode(property.id + ' - '));
			}
			
			label.appendChild(document.createTextNode(property.name[smart_lang]));
			container.appendChild(label);
			
			if (property.type == 'textarea') {
				var textarea = document.createElement('textarea');
					textarea.setAttribute('id', 'onix'+property.id);
					textarea.setAttribute('rows', 5);
				container.appendChild(textarea);
			}
			
			else if (property.type == 'text') {
	    		var input = document.createElement('input');
	    			input.setAttribute('type','text');
	    			input.setAttribute('id','onix'+property.id);
	    		container.appendChild(input);
			}
			
			else if (property.type == 'checkbox') {
			
				for (var j = 0; j < property.values.length; j++) {
		    		var input_label = document.createElement('label');
		    		
		    		var input = document.createElement('input');
		    			input.setAttribute('type','checkbox');
		    			input.setAttribute('id','onix'+property.values[j].id);
		    		
		    		input_label.appendChild(input);
		    		input_label.appendChild(document.createTextNode(' ' + property.values[j].id + ' - ' + property.values[j].name[smart_lang]));
		    		container.appendChild(input_label);
				}
			}
			
			else {
				console.log('Unknown property type ' + property.type);
			}
			
			meta_fields.appendChild(container);
		}
		
		/* sync summary changes */
		$('#onix00').keyup( function(){
			smartDiscovery.syncSummary('distribution');
			return false;
		});
		
		/* sync accessibility features */
		$('#distribution-fields input[type="checkbox"]').change( function(){
			smartDiscovery.syncFeature('distribution',this.id,this.checked);
			return false;
		});
	}

	
	
	function generateONIXMetadata() {
	
		if (!validateONIXMetadata()) {
			if (!confirm(smart_errors.validation.general.failure[smart_lang])) {
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
			alert(smart_errors.validation.general.noMetadata[smart_lang]);
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
		addDistributionMetadata: function() {
			addDistributionMetadata();
		},
		
		generateONIXMetadata: function() {
			generateONIXMetadata();
		}
	}

})();
