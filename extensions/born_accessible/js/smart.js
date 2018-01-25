
'use strict';

smart_extensions['born_accessible'] = (function() {
	/* 
	 * if setting a logo, array values are: [0] credential image url, [1] alt text, [2] link to credential info
	 * 
	 * example: var _LOGO = ['https://example.com/image.jpg', 'Certified by FooBar', 'https://example.com/moreinfo']
	 * 
	 * result: <a href="https://example.com/moreinfo"><img src="https://example.com/image.jpg" alt="Certified by FooBar"/></a>
	 */ 
	
	var _LOGO = [];
	var _SCORE_TEXT_CSS = {
		0: 'bad',
		1: 'mid',
		2: 'mid',
		3: 'mid',
		4: 'good',
		'N/A': 'na',
		'Not specified': 'na'
	}
	
	
	return {
	
		LOGO: _LOGO,
		
		clear: function() {
			
			// reset the output options
			var output_options = ['ba-output-report', 'ba-output-notes'];
			
			output_options.forEach(function(id) {
				var checkbox = document.getElementById(id);
				if (checkbox && !checkbox.checked) {
					checkbox.click();
				}
			});
			
			// reset text inputs
			var inputs = document.querySelectorAll('#born_accessible #ba-content-inputs input[type="text"], #born_accessible #ba-content-inputs textarea');
			
			for (var i = 0; i < inputs.length; i++) {
				inputs[i].value = '';
			}
			
			// reset the epub complexity setting
			var complexity = document.querySelector('#born_accessible #ba-content-inputs input[name="ba-complexity-level"]:checked');
			
			if (complexity) {
				complexity.checked = false;
			}
			
			// reset the filters
			
			var filters = document.querySelectorAll('#born_accessible input.test-filter:checked');
			
			if (filters) {
				for (var i = 0; i < filters.length; i++) {
					filters.click();
				}
			}
			
			// unset all the tests
			var fields = document.querySelectorAll('#born_accessible fieldset.test');
			
			for (var i = 0; i < fields.length; i++) {
				var checked_score = fields[i].querySelector('input:checked');
				if (checked_score) { checked_score.checked = false; }
				
				fields[i].querySelector('textarea').value = '';
			}
			
		},
		
		
		
		validate: function() {
			
			var is_valid = true;
			
			// verify all stats are numbers
			
			var stats = document.querySelectorAll('section#born_accessible div#ba-content-inputs input[type="text"]');
			
			for (var i = 0; i < stats.length; i++) {
				var value = stats[i].value.trim();
				if (value && !value.match(/^[0-9]+$/)) {
					smartError.logError({tab_id: 'born_accessible', element_id: stats[i].id, severity: 'err', message: 'Born Accessible statistics must be numbers.'});
					smartFormat.setFieldToError({id: stats[i].id, is_warning: false, highlight_parent: true});
					is_valid = false;
				}
				else {
					smartFormat.setFieldToPass({id: stats[i].id, highlight_parent: true});
				}
			}
			
			// verify an executive summary is included
			
			if (document.getElementById('ba-executive-summary').value.trim() == '') {
					smartError.logError({tab_id: 'born_accessible', element_id: 'ba-executive-summary', severity: 'err', message: 'Born Accessible report must include an executive summary.'});
					smartFormat.setFieldToError({id: 'ba-executive-summary', is_warning: false, highlight_parent: true});
					is_valid = false;
			}
			else {
				smartFormat.setFieldToPass({id: 'ba-executive-summary', highlight_parent: true});
			}
			
			// verify the complexity has been set
			
			if (!document.querySelector('section#born_accessible fieldset#complexity-levels-section input[name="ba-complexity-level"]:checked')) {
					smartError.logError({tab_id: 'born_accessible', element_id: 'complexity-levels-section', severity: 'err', message: 'Born Accessible complexity level must be specified.'});
					smartFormat.setFieldToError({id: 'complexity-levels-section', is_warning: false, highlight_parent: false});
					is_valid = false;
			}
			else {
				smartFormat.setFieldToPass({id: 'complexity-levels-section', highlight_parent: false});
			}
			
			// verify all tests have a selected value
			
			var tests = document.querySelectorAll('#born_accessible fieldset.test');
			
			for (var i = 0; i < tests.length; i++) {
				var has_score = tests[i].querySelector('input:checked');
				if (!has_score) {
					smartError.logError({tab_id: 'born_accessible', element_id: tests[i].id, severity: 'err', message: 'Born Accessible test "' + tests[i].querySelector('legend').textContent + '" does not have a score.'});
					smartFormat.setFieldToError({id: tests[i].id, is_warning: false, highlight_parent: false});
					is_valid = false;
				}
				else {
					smartFormat.setFieldToPass({id: tests[i].id, highlight_parent: false});
				}
			}
			
			return is_valid;
		},
		
		
		
		generateReport: function() {
			
			var reportHTML = document.createElement('section');
				reportHTML.setAttribute('class','js-tabcontent');
				reportHTML.setAttribute('id','born_accessible');
			
			var tab_hd = document.createElement('h3');
				tab_hd.appendChild(document.createTextNode('Born Accessible Report'));
			
			reportHTML.appendChild(tab_hd);
			
			var executive_summary = document.createElement('section');
				executive_summary.setAttribute('id','ba-exec-summary');
			
			var executive_summary_hd = document.createElement('h4');
				executive_summary_hd.appendChild(document.createTextNode('Executive Summary'));
			executive_summary.appendChild(executive_summary_hd);
			
			var executive_summary_para = document.createElement('p');
				executive_summary_para.appendChild(document.createTextNode(document.getElementById('ba-executive-summary').value))
			executive_summary.appendChild(executive_summary_para);
			
			reportHTML.appendChild(executive_summary);
			
			var test_scores = document.createElement('section');
				test_scores.setAttribute('id','ba-scores')
			
			var test_scores_hd = document.createElement('h4');
				test_scores_hd.appendChild(document.createTextNode('Scoring'));
			test_scores.appendChild(test_scores_hd);
			
			var score_list = document.createElement('ul');
				score_list.setAttribute('class', 'ba-score-list')
			
			var test_sections = document.querySelectorAll('#born_accessible section.test');
			
			var max_score = 0;
			var actual_score = 0;
			
			for (var i = 0; i < test_sections.length; i++) {
				var max_section_score = 0;
				var actual_section_score = 0;
				var isNA = true;
				
				var tests = test_sections[i].querySelectorAll('fieldset');
				
				var test_group_list = document.createElement('ul');
				
				for (var j = 0; j < tests.length; j++) {
					var score = tests[j].querySelector('input:checked');
					
					var score_li = document.createElement('li');
						score_li.setAttribute('class','ba-score');
					
					var score_label_li = document.createElement('span');
						score_label_li.appendChild(document.createTextNode(tests[j].querySelector('legend').textContent.replace(/^[0-9.]+ /, '')+':'));
					score_li.appendChild(score_label_li);
					
					var score_value = score ? score.value : 'Not specified';
					
					var score_value_li = document.createElement('span');
					
					if (_SCORE_TEXT_CSS[score_value]) {
						score_value_li.classList.add(_SCORE_TEXT_CSS[score_value]);
					}
					score_value_li.appendChild(document.createTextNode(score_value));
					
					score_li.appendChild(score_value_li);
					
					if (document.getElementById('ba-output-notes').checked) {
						var note = tests[j].querySelector('textarea').value.trim();
						if (note) {
							var score_li_note = document.createElement('div');
								score_li_note.setAttribute('class','ba-score-note');
							
							var score_li_note_label = document.createElement('strong');
								score_li_note_label.appendChild(document.createTextNode('Note:'));
								
							score_li_note.appendChild(score_li_note_label);
							score_li_note.appendChild(document.createTextNode(' '+note));
							score_li.appendChild(score_li_note);
						}
					}
					
					test_group_list.appendChild(score_li)
					
					if (score_value != 'N/A' && score_value != 'Not specified') {
						actual_section_score += Number(score_value);
						max_section_score += 4;
						isNA = false;
					}
				}
				
				var ba_score_li  = document.createElement('li');
					ba_score_li.setAttribute('class','ba-score');
				
				var ba_score_label = document.createElement('span');
					ba_score_label.appendChild(document.createTextNode(test_sections[i].querySelector('h4').textContent.replace(/^[0-9.]+ /, '')+':'));
				ba_score_li.appendChild(ba_score_label);
				
				var section_score = 'N/A';
				
				if (!isNA) {
					section_score = (max_section_score == 0) ? '0%' : Math.round((actual_section_score / max_section_score) * 100) + '%';
				}
				
				var ba_score_value = document.createElement('span');
					ba_score_value.appendChild(document.createTextNode(section_score))
				ba_score_li.appendChild(ba_score_value);
				
				ba_score_li.appendChild(test_group_list);
				
				score_list.appendChild(ba_score_li);
				
				max_score += max_section_score;
				actual_score += actual_section_score;
			}
			
			var total_score = (max_score == 0) ? 0 : Math.round((actual_score / max_score) * 100);
			
			var ba_total_score_div  = document.createElement('div');
				ba_total_score_div.setAttribute('id','ba-total-score');
				ba_total_score_div.setAttribute('class','ba-primary');
			
			var score_span_label = document.createElement('span');
				score_span_label.appendChild(document.createTextNode('Born Accessible Score: '));
			
			ba_total_score_div.appendChild(score_span_label);
			
			var score_span_value = document.createElement('span');
				score_span_value.appendChild(document.createTextNode(total_score+'%'));
			
			ba_total_score_div.appendChild(score_span_value);
			
			test_scores.appendChild(ba_total_score_div);
			
			test_scores.appendChild(score_list);
			
			reportHTML.appendChild(test_scores);
			
			var stat_section = document.createElement('section');
				stat_section.setAttribute('id','born-accessible-stats');
			
			var stat_hd = document.createElement('h4');
				stat_hd.appendChild(document.createTextNode('Statistics'))
			stat_section.appendChild(stat_hd);
			
			var complexity_selected = document.querySelector('input[name="ba-complexity-level"]:checked');
			
			var complexity_level = complexity_selected ? complexity_selected.parentNode.textContent : 'Not specified';
			
			var complexity_div = document.createElement('div');
				complexity_div.setAttribute('id','ba-epub-complexity');
				complexity_div.setAttribute('class','ba-primary');
			
			var complexity_span = document.createElement('span');
				complexity_span.appendChild(document.createTextNode('EPUB Complexity Level: '));
			complexity_div.appendChild(complexity_span);
			
			var complexity_score = document.createElement('span');
				complexity_score.appendChild(document.createTextNode(complexity_level));
			complexity_div.appendChild(complexity_score);
			
			stat_section.appendChild(complexity_div);
			
			var stat_table = document.createElement('table');
			
			var stat_table_thead = document.createElement('thead');
			
			var stat_table_trow = document.createElement('tr');
			
			var stat_table_type_th = document.createElement('th');
				stat_table_type_th.appendChild(document.createTextNode('Content Structure'));
			stat_table_trow.appendChild(stat_table_type_th);
			
			var stat_table_count_th = document.createElement('th');
				stat_table_count_th.appendChild(document.createTextNode('Count'));
			stat_table_trow.appendChild(stat_table_count_th);
			
			stat_table_thead.appendChild(stat_table_trow);
			
			stat_table.appendChild(stat_table_thead);
			
			var stat_table_tbody = document.createElement('tbody');
			
			var stats = document.querySelectorAll('#born_accessible #ba-content-inputs label');
			
			for (var i = 0; i < stats.length; i++) {
				var stat = stats[i].querySelector('input[type="text"]');
				if (stat) {
					var stat_trow = document.createElement('tr');
					
					var stat_title_td = document.createElement('td');
						stat_title_td.appendChild(document.createTextNode(stats[i].querySelector('span').textContent));
					stat_trow.appendChild(stat_title_td);
					
					var stat_count = stat.value.trim();
					
					var stat_value_td = document.createElement('td');
						stat_value_td.appendChild(document.createTextNode(stat_count != '' ? stat_count : '0'));
					stat_trow.appendChild(stat_value_td);
					
					stat_table_tbody.appendChild(stat_trow);
				}
			}
			
			stat_table.appendChild(stat_table_tbody);
			
			stat_section.appendChild(stat_table);
			
			reportHTML.appendChild(stat_section);
			
			return reportHTML;
		},
		
		
		
		saveData: function() {
		
			var JSON = {configuration: {}, info: {}, statistics: {}, scores: []};
			
			// add executive summary
			
			JSON.info['ba-executive-summary'] = document.querySelector('#born_accessible #ba-content-inputs textarea').value;
			
			// add epub complexity
			
			var complexity = document.querySelector('#born_accessible #ba-content-inputs input[name="ba-complexity-level"]:checked');
			
			JSON.info['ba-complexity-level'] = complexity ? complexity.id : '';
			
			// add content stats
			
			var stats = document.querySelectorAll('#born_accessible #ba-content-inputs input[type="text"]');
			
			for (var i = 0; i < stats.length; i++) {
				JSON.statistics[stats[i].id] = stats[i].value;
			}
			
			// add test exclusions
			
			var exclusions = document.querySelectorAll('#born_accessible #ba-test-exclusions input:checked');
			
			JSON.configuration.exclusions = [];
			
			for (var i = 0; i < exclusions.length; i++) {
				JSON.configuration.exclusions.push(exclusions[i].value);
			}
			
			// add test scores
			
			var tests = document.querySelectorAll('#born_accessible fieldset.test');
			
			for (var i = 0; i < tests.length; i++) {
				var score_info = {};
				var checked_score = tests[i].querySelector('input:checked');
				var score = checked_score ? checked_score.value : '';
				var note = tests[i].querySelector('textarea').value;
				
				score_info.id = tests[i].id;
				score_info.score = score;
				score_info.note = note;
				
				JSON.scores.push(score_info);
			}
			
			return JSON;
		},
		
		
		
		loadData: function(JSON) {
		
			if (JSON.hasOwnProperty('born_accessible') && JSON.born_accessible) {
				// load statistics
				for (var key in JSON.born_accessible.statistics) {
					document.getElementById(key).value = JSON.born_accessible.statistics[key];
				}
				
				// load the executive summary
				document.getElementById('ba-executive-summary').value = JSON.born_accessible.info['ba-executive-summary'];
				
				// load complexity
				if (JSON.born_accessible.info['ba-complexity-level']) {
					document.querySelector('input[name="ba-complexity-level"][id="' + JSON.born_accessible.info['ba-complexity-level'] + '"]').click();
				}
				
				// set test exclusions
				
				if (JSON.born_accessible.configuration.exclusions) {
					JSON.born_accessible.configuration.exclusions.forEach(function(type) {
						document.querySelector('#born_accessible #ba-test-exclusions input[value="' + type + '"]').click();
					});
				}
				
				// load test scores
				JSON.born_accessible.scores.forEach(function(test) {
					var field = document.getElementById(test.id);
					if (test.hasOwnProperty('score') && test.score != '') {
						field.querySelector('input[value="' + test.score + '"]').click();
					}
					if (test.hasOwnProperty('note') && test.note != '') {
						field.querySelector('textarea').value = test.note;
					}
				});
			}
			
			else {
				var test_types = [{id: 'images', aceID: 'images'}, {id: 'audio', aceID: 'audios'}, {id: 'video', aceID: 'videos'}, {id: 'javascript', aceID: 'scripts'}];
				
				test_types.forEach(function(test) {
					if (!JSON.data.hasOwnProperty(test.aceID) || !JSON.data[test.aceID]) {
						document.querySelector('#ba-test-exclusions input[value="' + test.id + '"]').click();
					}
				});
				
				if (!JSON.properties.hasOwnProperty('hasMathML') || !JSON.properties.hasMathML) {
					document.querySelector('#ba-test-exclusions input[value="math"]').click();
				}
			}
		}
	}
})();
