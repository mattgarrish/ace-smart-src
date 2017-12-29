'use strict';

var smartWCAG = (function() {
	var _level = 'aa';
	var _classList = '|a|aa|';
	
	return {
		WCAGLevel: _level,
		WCAGClassList: _classList,
		
		update: function() {
			var new_classList = '|a|';
				new_classList += classList == 'aa' ? 'aa|' : (document.getElementById('show-aa').checked ? 'aa|' : '');
				new_classList += document.getElementById('show-aaa').checked ? 'aaa|' : '';
			_classList = new_classList;
		},
		
		setWCAGLevel: function(newLevel) {
			_level = newLevel;
		}
	}
})();
