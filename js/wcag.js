'use strict';

/* 
 * 
 * smartWCAG
 * 
 * Maintains state about the WCAG level being tested.
 * 
 * Public variables:
 * 
 * - WCAGLevel - WCAG conformance level being tested for (a or aa)
 * 
 * - WCAGClassList - used to filter out unwanted success criteria via .contains() on section class name
 * 
 * Public functions:
 * 
 * - setWCAGClassList - sets _classList based on the currently selected options
 * 
 * - setWCAGLevel - set _level to the user's current choice
 * 
 */

var smartWCAG = (function() {
	var _level = 'aa';
	var _classList = '|a|aa|';
	
	return {
		WCAGLevel: _level,
		WCAGClassList: _classList,
		
		setWCAGClassList: function() {
			var new_classList = '|a|';
				new_classList += _level == 'aa' ? 'aa|' : (document.getElementById('show-aa').checked ? 'aa|' : '');
				new_classList += document.getElementById('show-aaa').checked ? 'aaa|' : '';
			_classList = new_classList;
		},
		
		setWCAGLevel: function(newLevel) {
			_level = newLevel;
		}
	}
})();
