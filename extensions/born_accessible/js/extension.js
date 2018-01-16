
smart_extensions['born_accessible'] = (function() {
	/* 
	 * if setting a logo, array values are: [0] credential image url, [1] alt text, [2] link to credential info
	 * 
	 * example: var _LOGO = ['https://example.com/image.jpg', 'Certified by FooBar', 'https://example.com/moreinfo']
	 * 
	 * result: <a href="https://example.com/moreinfo"><img src="https://example.com/image.jpg" alt="Certified by FooBar"/></a>
	 */ 
	
	var _LOGO = [];
	
	return {
	
		LOGO: _LOGO,
		
		clear: function() {
			
			var fields = document.querySelectorAll('#born_accessible fieldset');
			
			for (var i = 0; i < fields.length; i++) {
				fields[i].querySelector('input:first-child').click();
				fields[i].querySelector('textarea').value = '';
			}
			
		},
		
		validate: function() {
			
			var valid = true;
			
			// add any validation calls before generating HTML here
			
			return valid;
		},
		
		generateReport: function() {
			
			var reportHTML = document.createElement('section');
				reportHTML.setAttribute('class','js-tabcontent');
				reportHTML.setAttribute('id','born_accessible');
			
			var tab_hd = document.createElement('h3');
				tab_hd.appendChild(document.createTextNode('Born Accessible Score'));
			
			reportHTML.appendChild(tab_hd);
			
			var display_table = document.createElement('div');
				display_table.setAttribute('class', 'table')
			
			var scores = document.querySelectorAll('div.ba-score');
			
			for (var i = 0; i < scores.length; i++) {
				display_table.appendChild(scores[i].cloneNode(true));
			}
			
			reportHTML.appendChild(display_table);
			
			return reportHTML;
		},
		
		saveData: function() {
		
			var JSON = {};
			
			var fields = document.querySelectorAll('#born_accessible fieldset.test');
			
			for (var i = 0; i < fields.length; i++) {
				var score = fields[i].querySelector('input:checked').value;
				var note = fields[i].querySelector('textarea').value;
				JSON[fields[i].id] = {};
				JSON[fields[i].id].score = score;
				JSON[fields[i].id].note = note;
			}
			
			return JSON;
		},
		
		
		loadData: function(JSON) {
		
			for (var key in JSON) {
				var field = document.getElementById(key);
				if (JSON[key].hasOwnProperty('score') && JSON[key].score != 'N/A') {
					field.querySelector('input[value="' + JSON[key].score + '"]').click();
				}
				if (JSON[key].hasOwnProperty('note') && JSON[key].note != '') {
					field.querySelector('textarea').value = JSON[key].note;
				}
			}
		}
	}
	
})();
