
'use strict';

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
		
		setEPUBVersion: function(num) {
			_epubVersion = num;
		},
		
		
		createMetaTag: function(options) {
			options = typeof(options) === 'object' ? options : {};
			options.type = options.type ? options.type : 'meta';
			options.property = options.property ? options.property : '';
			options.value = options.value ? options.value : '';
			
			if (options.value.trim() != '') {
				if (_epubVersion == 3) {
					if (options.type == 'meta') {
						return '<meta property="' + options.property + '">' + options.value + '</meta>\n';
					}
					else {
						return '<link rel="' + options.property + '" href="' + options.value + '"/>\n';
					}
				}
				else {
					return '<meta name="' + options.property + '" content="' + options.value + '"/>\n';
				}
			}
			return '';
		},
		
		
		convertUTCDateToString: function (utcDate) {
			var date_options = { weekday: "long", year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" };  
			
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
		
		
		generateTimestamp: function(sep) {
			var today = new Date();
			var timestamp= today.toLocaleString('en-us', { month: 'long' }) + ' ' + today.getDate() + ', ' + today.getFullYear();
				timestamp += (sep == 'dash') ? '-' : ' at ' 
				timestamp += today.getHours().pad(2) + ':' + today.getMinutes().pad(2) + ':' + today.getSeconds().pad(2);
			return timestamp;
		}
	}

})();



/* zero pad times */
Number.prototype.pad = function (len) {
	return (new Array(len+1).join("0") + this).slice(-len);
}
