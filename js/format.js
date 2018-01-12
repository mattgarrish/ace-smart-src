
'use strict';

/* 
 * 
 * smartFormat
 * 
 * Provides content formatting functions
 * 
 * Public variables:
 * 
 * - BG - Background css class names
 * 
 * Public functions:
 * 
 * - setEPUBVersion - called to set _epubVersion to the version of the publication being evaluated
 * 
 * - createMetaTag - creates a package document meta/link tag compliant with the specified version of EPUB
 * 
 * - elementValueEscape - basic escaping for package meta element content
 * 
 * - attributeValueEscape - basic escaping for package meta/link attribute content
 * 
 * - convertUTCDateToString - converts a datetime value (YYYY-MM-DDTHH:MM:SSZ) into a human-readable string
 * 
 * - formatIdentifier - formats as urn scheme to human-readable string
 * 
 * - toTitleCase - converts a string to title case - capitalizes each word
 * 
 * - generateTimestamp - returns a human-readable timestamp for the current date and time
 * 
 * - setFieldToError - highlights warnings/errors and sets aria-invalid
 * 
 * - setFieldToPass - highlights passes and unsets aria-invalid
 * 
 */

var smartFormat = (function() {
	
	var _epubVersion = 3;
	
	var _BG = {
		"ERR": 'err',
		"FAIL": 'err',
		"NA": 'na',
		"PASS": 'pass',
		"WARN": 'warn'
	};
	
	return {
		BG: _BG,
		
		setEPUBVersion: function(newVersion) {
			console.log(_epubVersion);
		},
		
		
		createMetaTag: function(options) {
			options = typeof(options) === 'object' ? options : {};
			options.type = options.type ? options.type : 'meta';
			options.property = options.property ? options.property : '';
			options.value = options.value ? options.value : '';
			
			if (options.value.trim() != '') {
				if (_epubVersion == 3) {
					if (options.type == 'meta') {
						return '<meta property="' + options.property + '">' + this.elementValueEscape(options.value) + '</meta>\n';
					}
					else {
						return '<link rel="' + options.property + '" href="' + this.attributeValueEscape(options.value) + '"/>\n';
					}
				}
				else {
					return '<meta name="' + options.property + '" content="' + this.attributeValueEscape(options.value) + '"/>\n';
				}
			}
			return '';
		},
		
		
		elementValueEscape: function(value) {
			return value.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
		},
		
		
		attributeValueEscape: function(value) {
			return value.replace(/&/g,'&amp;').replace(/"/g,'&quot;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/\r?\n/g, ' ');
		},
		
		
		convertUTCDateToString: function (utcDate) {
			var date_options = { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };  
			
			return (utcDate == '') ? '' : new Date(utcDate).toLocaleDateString("en",date_options);
		},
		
		
		formatIdentifier: function (identifier) {
			if (identifier.match(/urn:isbn:/i)) {
				identifier = 'ISBN ' + identifier.replace('urn:isbn:','');
			}
			else {
				identifier = identifier.replace(/urn:[a-z0-9]+:/i, '');
			}
			return identifier;
		},
		
		
		toTitleCase: function(str) {
			return str.replace(/\w\S*/g, function(txt){return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();});
		},
		
		
		generateTimestamp: function(seperator, date) {
			var today = date ? new Date(date) : new Date();
			var timestamp= today.toLocaleString('en-us', { month: 'long' }) + ' ' + today.getDate() + ', ' + today.getFullYear();
				timestamp += (seperator == 'dash') ? '-' : ' at ' 
				timestamp += today.getHours().pad(2) + ':' + today.getMinutes().pad(2) + ':' + today.getSeconds().pad(2);
			return timestamp;
		},
		
		
		setFieldToError: function(options) {
			options = typeof(options) === 'object' ? options : {};
			if (!options.hasOwnProperty('id') || !options.id) {
				return;
			}
			options.is_warning = options.hasOwnProperty('is_warning') ? options.is_warning : false;
			options.highlight_parent = options.hasOwnProperty('highlight_parent') ? options.highlight_parent : false;
			
			var field = document.getElementById(options.id);
				field.setAttribute('aria-invalid', (options.is_warning ? false : true));
			
			if (options.highlight_parent) {
				field.parentNode.classList.remove(_BG.PASS,_BG.WARN,_BG.ERR);
				field.parentNode.classList.add(options.is_warning ? _BG.WARN : _BG.ERR);
			}
			
			else {
				field.classList.remove(_BG.PASS,_BG.WARN,_BG.ERR);
				field.classList.add(options.is_warning ? _BG.WARN : _BG.ERR);
			}
		},
		
		
		setFieldToPass: function(options) {
			options = typeof(options) === 'object' ? options : {};
			if (!options.hasOwnProperty('id') || !options.id) {
				return;
			}
			options.highlight_parent = options.hasOwnProperty('highlight_parent') ? options.highlight_parent : false;
			
			var field = document.getElementById(options.id);
				field.setAttribute('aria-invalid', false);
			
			if (options.highlight_parent) {
				field.parentNode.classList.remove(_BG.PASS,_BG.WARN,_BG.ERR);
				field.parentNode.classList.add(_BG.PASS);
			}
			
			else {
				field.classList.remove(_BG.PASS,_BG.WARN,_BG.ERR);
				field.classList.add(_BG.PASS);
			}
		}

	}

})();



/* zero pad times */
Number.prototype.pad = function (len) {
	return (new Array(len+1).join("0") + this).slice(-len);
}
