
'use strict';

/* 
 * 
 * smartDiscovery
 * 
 * Validates and generates discovery metadata
 * 
 * Public functions
 * 
 * - validateDiscoveryMetadata - checks discovery metadata for errors and warnings
 * 
 * - generateDiscoveryMetadata - generates the set of tags for the package document 
 * 
 * - addCustomFeature - adds a custom accessibilityFeature to the form
 *  
 * - addNewSufficientSet - adds an additional blank set for accessModeSufficient
 * 
 */

var discovery_dialog;

var smartDiscovery = (function() { 

	var _PROP_ERROR = { accessibilityFeature: {}, accessibilityHazard: {}, accessMode: {}, accessibilitySummary: {}, accessModeSufficient: {} };
		
		_PROP_ERROR.accessibilityFeature.msg = smart_discovery_meta[smart_lang].accessibilityFeature;
		_PROP_ERROR.accessibilityFeature.warn = false;
		
		_PROP_ERROR.accessibilityHazard.msg = smart_discovery_meta[smart_lang].accessibilityHazard;
		_PROP_ERROR.accessibilityHazard.warn = false;
		
		_PROP_ERROR.accessMode.msg = smart_discovery_meta[smart_lang].accessMode;
		_PROP_ERROR.accessMode.warn = false;
		
		_PROP_ERROR.accessibilitySummary.msg = smart_discovery_meta[smart_lang].accessibilitySummary;
		_PROP_ERROR.accessibilitySummary.warn = false;
		
		_PROP_ERROR.accessModeSufficient = { missing: {}, none: {}, duplicate: {} };
		
		_PROP_ERROR.accessModeSufficient.missing.msg = smart_discovery_meta[smart_lang].accessModeSufficient_missing;
		_PROP_ERROR.accessModeSufficient.missing.warn = true;
		 
		_PROP_ERROR.accessModeSufficient.none.msg = smart_discovery_meta[smart_lang].accessModeSufficient_none;
		_PROP_ERROR.accessModeSufficient.none.warn = true;

		_PROP_ERROR.accessModeSufficient.duplicate.msg = smart_discovery_meta[smart_lang].accessModeSufficient_duplicate;
		_PROP_ERROR.accessModeSufficient.duplicate.warn = false;
	
	
	/* checks that at least one item has been checked for required metadata */
	function validateDiscoveryMetadata(clear) {
	
		if (clear) {
			smartError.clearAll('discovery');
		}
		
		var is_valid = true;
		
		is_valid = verifyOneItemChecked('accessibilityFeature');
		
		if (document.getElementById('accessibilitySummary').value.replace(/\s/g,'') == '') {
			smartError.logError({tab_id: 'discovery', element_id: 'summary-field', severity: 'err', message: _PROP_ERROR['accessibilitySummary'].msg});
			smartFormat.setFieldToError({id: 'summary-field', is_warning: _PROP_ERROR['accessibilitySummary'].warn, highlight_parent: false});
			is_valid = false;
		}
		
		else {
			smartFormat.setFieldToPass({id: 'summary-field', highlight_parent: false});
		}
		
		is_valid = verifyOneItemChecked('accessibilityHazard') ? is_valid : false;
		
		is_valid = verifyOneItemChecked('accessMode') ? is_valid : false;
		
		is_valid = verifySufficientModes() ? is_valid : false;
		
		// optional metadata gets an automatic pass
		smartFormat.setFieldToPass({id: 'accessibilityAPI', highlight_parent: false});
		smartFormat.setFieldToPass({id: 'accessibilityControl', highlight_parent: false});
		
		return is_valid;
		
	}
	
	
	/* checks that at least one checkbox in the specified fieldset is checked */
	function verifyOneItemChecked(id, found) {
		var checked_items = document.querySelectorAll('fieldset#' + id + ' input:checked')
		
		if (checked_items.length > 0) {
			smartFormat.setFieldToPass({id: id, highlight_parent: false});
			return true;
		}
		
		else {
			smartError.logError({tab_id: 'discovery', element_id: id, severity: 'err', message: _PROP_ERROR[id].msg});
			smartFormat.setFieldToError({id: id, is_warning: _PROP_ERROR[id].warn, highlight_parent: false});
			return false;
		}
	}
	
	
	/* checks that sufficient modes are set and don't repeat themselves */
	function verifySufficientModes() {
		var fieldsets = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset');
		var sufficient_mode_sets = [];
		
		// check sufficient modes have been checked
		for (var i = 0; i < fieldsets.length; i++) {
			var checked_modes = fieldsets[i].querySelectorAll('input:checked');
			var this_set = '';
			
			for (var j = 0; j < checked_modes.length; j++) {
				this_set += checked_modes[j].value;
				
				// issue a warning if not also selected as a primary access mode
				if (!document.querySelector('input[type="checkbox"][id="'+checked_modes[j].value+'"]:checked')) {
					smartError.logError({tab_id: 'discovery', element_id: 'accessModeSufficient', severity: 'warn', message: _PROP_ERROR.accessModeSufficient.missing.msg.replace('%%val%%', checked_modes[j].value)});
					smartFormat.setFieldToError({id: 'accessModeSufficient', is_warning: _PROP_ERROR.accessModeSufficient.missing.warn, highlight_parent: false});
					return false;
				}
			}
			
			if (this_set != '') {
				sufficient_mode_sets.push(this_set);
			}
		}
	
		if (sufficient_mode_sets.length == 0) {
			smartError.logError({tab_id: 'discovery', element_id: 'accessModeSufficient', severity: 'warn', message: _PROP_ERROR.accessModeSufficient.none.msg});
			smartFormat.setFieldToError({id: 'accessModeSufficient', is_warning: _PROP_ERROR.accessModeSufficient.none.warn, highlight_parent: false});
			return false;
		}
		
		else if (sufficient_mode_sets.length > 1) {
			// check there are no duplicate sets
			sufficient_mode_sets.sort();
			for (var i = 1; i < sufficient_mode_sets.length; i++) {
				if (sufficient_mode_sets[i] == sufficient_mode_sets[i-1]) {
					smartError.logError({tab_id: 'discovery', element_id: 'accessModeSufficient', severity: 'err', message: _PROP_ERROR.accessModeSufficient.duplicate.msg});
					smartFormat.setFieldToError({id: 'accessModeSufficient', is_warning: _PROP_ERROR.accessModeSufficient.duplicate.warn, highlight_parent: false});
					return false;
				}
			}
		}
		
		smartFormat.setFieldToPass({id: 'accessModeSufficient', highlight_parent: false});
		
		return true;
	}
	
	
	/* generates accessibility metadata tags for the package document */
	function generateDiscoveryMetadata() {
	
		if (!validateDiscoveryMetadata()) {
			if (!confirm('Metadata does not validate!\n\nClick Ok to generate anyway or Cancel to close this dialog and correct.')) {
				return;
			}
		}
		
		var discovery_metadata = document.getElementById('discovery-metadata');
			discovery_metadata.value = '';
		
		var meta_tags = '';
		
		// add accessibility features
		meta_tags += addMetaTag('schema:accessibilityFeature', 'accessibilityFeature');
		
		// add the summary
		meta_tags += smartFormat.createMetaTag({type: 'meta', property: 'schema:accessibilitySummary', value: document.getElementById('accessibilitySummary').value});
		
		// add hazards
		meta_tags += addMetaTag('schema:accessibilityHazard', 'accessibilityHazard');
		
		// add access modes
		meta_tags += addMetaTag('schema:accessMode', 'accessMode');
		
		// add sufficent access modes
		meta_tags += addSufficientSetTags('schema:accessModeSufficient');
		
		// add apis
		meta_tags += addMetaTag('schema:accessibilityAPI', 'accessibilityAPI');
		
		// add controls
		meta_tags += addMetaTag('schema:accessibilityControl', 'accessibilityControl');
		
		if (meta_tags == '') {
			alert('No metadata specified. Failed to generate.');
		}
		
		else {
			discovery_metadata.value = meta_tags;
			if (discovery_dialog) {
				discovery_dialog.dialog('open');
			}
		}
	}
	
	
	/* generates a meta tag for the specified property */
	function addMetaTag(property, id) {
		var checked_values = document.getElementById(id).querySelectorAll('input:checked');
		var meta_tag = '';
		
		for (var i = 0; i < checked_values.length; i++) {
			meta_tag += smartFormat.createMetaTag({type: 'meta', property: property, value: checked_values[i].value});
		}
		
		return meta_tag;
	}
	
	
	/* concatenates the sufficient modes into a comma-separate string and generates the meta tag */
	function addSufficientSetTags(property) {
		var meta_tags = '';
		var fieldsets = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset');
		
		for (var i = 0; i < fieldsets.length; i++) {
			var checked_modes = fieldsets[i].querySelectorAll('input:checked');
			var sufficient_set = '';
			
			for (var j = 0; j < checked_modes.length; j++) {
				sufficient_set += sufficient_set ? ',' : '';
				sufficient_set += checked_modes[j].value;
			}
			
			if (sufficient_set) {
				meta_tags += smartFormat.createMetaTag({type: 'meta', property: property, value: sufficient_set});
			}
		}
		
		return meta_tags;
	
	}
	
	
	/* adds a new user-defined accessibility feature to the form */
	function addCustomFeature(feature_name) {
		
		if (!feature_name) {
			feature_name = prompt('Enter the accessibility feature as it will appear in the metadata:').trim();
		}
		
		if (feature_name) {
		
			if (document.getElementById(feature_name)) {
				alert('Feature already exists. Unable to add');
			}
			
			else {
				var new_feature_label = document.createElement('label');
					new_feature_label.setAttribute('class', 'custom');
				
				var new_feature_checkbox = document.createElement('input');
					new_feature_checkbox.setAttribute('type', 'checkbox');
					new_feature_checkbox.setAttribute('value', feature_name);
					new_feature_checkbox.setAttribute('checked', 'checked');
				
				new_feature_label.appendChild(new_feature_checkbox);
				
				new_feature_label.appendChild(document.createTextNode(' ' + feature_name));
				
				// get the link to add new features
				var add_feature_link = document.getElementById('add-feature');
				
				// append the new feature to the column-formatted div before the link
				add_feature_link.parentNode.getElementsByClassName('cols')[0].appendChild(new_feature_label, add_feature_link);
			}
		}
		
		else {
			alert('Invalid feature value. Values must be at least one character in length.');
		}
	}
	
	
	/* adds an additional sufficient set to the form */
	function addNewSufficientSet() {
	
		var set_count = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset').length + 1;
		
		var new_fieldset = document.createElement('fieldset');
			new_fieldset.setAttribute('id', 'set' + set_count);
			new_fieldset.setAttribute('class', 'custom');
		
		var legend = document.createElement('legend');
			legend.appendChild(document.createTextNode('Set ' + set_count));
		
		new_fieldset.appendChild(legend);
		
		var new_column_wrapper_div = document.createElement('div');
			new_column_wrapper_div.setAttribute('class','cols');
		
		// list of access modes to add to the set
		var access_modes = ['auditory','tactile','textual','visual'];
		
		for (var i = 0; i < access_modes.length; i++) {
			var access_mode_label = document.createElement('label');
			
			var new_checkbox = document.createElement('input');
				new_checkbox.setAttribute('type', 'checkbox');
				new_checkbox.setAttribute('value', access_modes[i]);
			
			access_mode_label.appendChild(new_checkbox);
			access_mode_label.appendChild(document.createTextNode(' ' + access_modes[i]));
			
			new_column_wrapper_div.appendChild(access_mode_label);
		}
		
		new_fieldset.appendChild(new_column_wrapper_div);
		
		// get the link to add new sufficient modes
		var add_sufficient_set_link = document.getElementById('add-ams');
		
		// insert the new set before the link
		add_sufficient_set_link.parentNode.insertBefore(new_fieldset, add_sufficient_set_link);
	}
	
	
	
	return {
		addCustomFeature: function(feature_name) {
			addCustomFeature(feature_name);
		},
		
		addNewSufficientSet: function() {
			addNewSufficientSet();
		},
		
		validateDiscoveryMetadata: function() {
			return validateDiscoveryMetadata(false);
		},
		
		generateDiscoveryMetadata: function() {
			generateDiscoveryMetadata();
		}
	}

})();
