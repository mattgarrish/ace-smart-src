
'use strict';

var smartError = (function() {

	var _errorPane = undefined;
	var _errorMessages = undefined;
	
	var _errorPaneVisible = false;
	
	var _SEVERITY = {'err': 'ERROR', 'warn': 'WARNING'};
	
	return {
		init: function() {
			_errorPane = document.getElementById('error-pane');
			_errorMessages = document.getElementById('error-msg');
		},
		
		clearAll: function(scope) {
			this.clearMessagePane();
			this.clearAriaInvalid(scope);
			this.clearErrorBGs(scope);
		},
		
		clearMessagePane: function() {
			if (_errorMessages) {
				while (_errorMessages.firstChild) {
					_errorMessages.removeChild(_errorMessages.firstChild);
				};
			}
		},
		
		clearAriaInvalid: function(scope) {	
			scope = (scope != '') ? '#'+scope+' ' : ''; 
			var invalid = document.querySelectorAll(scope + '*[aria-invalid="true"]');
			for (var i = 0; i < invalid.length; i++) {
				invalid[i].setAttribute('aria-invalid',false);
			}
		},
		
		clearErrorBGs: function(scope) {
			var errorFields = { "discovery": ['accessibilityFeature', 'summary-field', 'accessibilityHazard', 'accessMode', 'accessModeSufficient', 'accessibilityAPI', 'accessibilityControl'],
						   "certification": ['certifiedBy']};
			
			if (scope != null && scope != '') {
				errorFields[scope].forEach( function(id) {
					document.getElementById(id).classList.remove(smartFormat.BG.ERR, smartFormat.BG.WARN, smartFormat.BG.PASS, smartFormat.BG.NA);
				});
			}
			
			else {
				for (var key in errorFields) {
					errorFields[key].forEach( function(id) {
						document.getElementById(id).classList.remove(smartFormat.BG.ERR, smartFormat.BG.WARN, smartFormat.BG.PASS, smartFormat.BG.NA);
					});
				}
			}
		},
		
		logError: function(options) {
			options = typeof(options) === 'object' ? options : {};
			options.tab_id = options.tab_id ? options.tab_id : '';
			options.element_id = options.element_id ? options.element_id : '';
			options.security_level = options.security_level ? options.security_level : '';
			
			if (!_errorMessages) {
				return;
			}
			
			if (!_errorPaneVisible) {
				this.showErrorPane();
			}
			
			var errorNumber = (_errorMessages.childElementCount + 1).pad(2);
			var error_li = document.createElement('li');
				error_li.setAttribute('id', 'err'+errorNumber);
		
			var error_link = document.createElement('a');
				error_link.setAttribute('href', '#err'+errorNumber);
				error_link.setAttribute('onclick', "smartError.jumpToError('"+options.tab_id+"','"+options.element_id+"'); return false;");
				error_link.appendChild(document.createTextNode('[' + _SEVERITY[options.severity] + '] ' + options.message));
			
			error_li.appendChild(error_link);
			_errorMessages.appendChild(error_li);
		},
		
		showErrorPane: function() {
			_errorPane.style.display = 'block';
			document.body.style.marginBottom = '13rem';
			_errorPaneVisible = true;
		},
		
		hideErrorPane: function() {
			_errorPane.style.display = 'none';
			document.body.style.marginBottom = '0';
			_errorPaneVisible = false;
		},
		
		jumpToError: function(tab,id) {
			document.getElementById('label_'+tab).click();
			
			var error_element = document.getElementById(id);
			
			var top = error_element.offsetTop;
				window.scrollTo(0,top-100);
			
			error_element.focus();
		}
		
	}

})();
