
'use strict';

/* 
 * 
 * bornAccessible
 * 
 * Functionality for the born accessible extension tab
*/

var bornAccessible = (function() {

	var _baTestData = '';
	var _extension_tab;
	
	function createBornAccessibleScoringTab() {
		
		// get the json data file
		$.ajax(
		{
			url: 'extensions/born_accessible/js/GCA_Consulting.json',
			data: {
				format: 'json'
			},
			dataType:		'json',
			cache:			false,
			success: function( data )
			{
				_baTestData = data;
				_extension_tab = document.getElementById('born_accessible'); 
				generateBornAccessibleTab();
				
			},
			error: function()
			{
				alert('Failed to load born accessible test data.' );
			}
		});
	}
	
	
	function generateBornAccessibleTab() {
		generateComplexity();
		addOutputOptions();
		addFilters();
		generateTests();
	}
	
	
	function generateComplexity() {
		var fieldset = document.createElement('fieldset');
			fieldset.id = _baTestData.epubComplexity['$complexityId'];
		
		var legend = document.createElement('legend');
			legend.appendChild(document.createTextNode(_baTestData.epubComplexity.complexityName))
		
		fieldset.appendChild(legend);
		
		var definition_list = document.createElement('dl');
		
		for (var i = 0; i < _baTestData.epubComplexity.complexityLevels.length; i++) {
			var definition_term = document.createElement('dt');
			
			var complexity_radio = document.createElement('input');
				complexity_radio.setAttribute('type','radio');
				complexity_radio.setAttribute('name',_baTestData.epubComplexity.complexityLevels[i]['$levelId']);
				complexity_radio.setAttribute('value',_baTestData.epubComplexity.complexityLevels[i].levelName);
					
				if (i == 0) {
					complexity_radio.setAttribute('checked','checked');
				}
				
			definition_term.appendChild(complexity_radio);
			definition_term.appendChild(document.createTextNode(' ' + _baTestData.epubComplexity.complexityLevels[i].levelName));
			
			definition_list.appendChild(definition_term);
				
			var definition_description = document.createElement('dd');
				definition_description.appendChild(document.createTextNode(_baTestData.epubComplexity.complexityLevels[i].levelDescription));
			
			definition_list.appendChild(definition_description);
		}
		
		fieldset.appendChild(definition_list);
		
		_extension_tab.appendChild(fieldset);
	}
	
	
	function addOutputOptions() {
		var output_fieldset = document.createElement('fieldset');
		
		var output_legend = document.createElement('legend');
			output_legend.appendChild(document.createTextNode('Output Options:'));
		
		output_fieldset.appendChild(output_legend);
		
		var display_options = [{id: 'ba_output_report', label: 'Include scoring in final report'},{id: 'ba_output_notes', label: 'Include notes in final report'}];
		
		display_options.forEach(function(options) {
			var label = document.createElement('label');
				label.setAttribute('class','data');
			
			var checkbox = document.createElement('input');
				checkbox.setAttribute('type','checkbox');
				checkbox.setAttribute('id',options.id);
				checkbox.setAttribute('checked','checked');
			
			label.appendChild(checkbox);
			
			label.appendChild(document.createTextNode((' ') + options.label));
			
			output_fieldset.appendChild(label);
		});
		
		_extension_tab.appendChild(output_fieldset);
	}
	
	
	function addFilters() {
		var filter_fieldset = document.createElement('fieldset');
		
		var filter_legend = document.createElement('legend');
			filter_legend.appendChild(document.createTextNode('Show only tests with score:'));
		
		filter_fieldset.appendChild(filter_legend);
		
		var scores = ['N/A',0,1,2,3,4];
		
		scores.forEach(function(score) {
			var label = document.createElement('label');
			
			var checkbox = document.createElement('input');
				checkbox.setAttribute('type','checkbox');
				checkbox.setAttribute('class','test-filter');
				checkbox.setAttribute('value',score);
			
			label.appendChild(checkbox);
			
			label.appendChild(document.createTextNode((' ') + score));
			
			filter_fieldset.appendChild(label);
		});
		
		_extension_tab.appendChild(filter_fieldset);
			
		/* watch for filter changes */
		$('section#born_accessible input.test-filter').click( function(){
			bornAccessible.filterTests();
		});
	}
	
	
	function generateTests() {
		
		for (var i = 0; i < _baTestData.bornAccessibleScoring.sections.length; i++) {
			var section = document.createElement('section');
				section.setAttribute('id', _baTestData.bornAccessibleScoring.sections[i]['$sectionId']);
			
			var section_number = (i+1) + '.';
			
			var hd = document.createElement('h3');
				hd.appendChild(document.createTextNode(section_number + ' ' + _baTestData.bornAccessibleScoring.sections[i].sectionName));
			
			section.appendChild(hd);
			
			for (var j = 0; j < _baTestData.bornAccessibleScoring.sections[i].sectionItems.length; j++) {
				var fieldset = document.createElement('fieldset');
					fieldset.setAttribute('id',_baTestData.bornAccessibleScoring.sections[i].sectionItems[j]['$itemId']);
					fieldset.setAttribute('class','test')
				
				var legend = document.createElement('legend');
					legend.appendChild(document.createTextNode(section_number + (j+1) + ' ' + _baTestData.bornAccessibleScoring.sections[i].sectionItems[j].itemName));
				
				fieldset.appendChild(legend);
				
				// add default NA value
				
				var has_default = false;
				
				if (_baTestData.bornAccessibleScoring.sections[i].sectionItems[j].itemScores.hasOwnProperty('N/A')) {
					fieldset.appendChild(createRadioInput(
						{
							name: _baTestData.bornAccessibleScoring.sections[i].sectionItems[j]['$itemId'],
							value: 'N/A',
							description: 'N/A' + ' \u2014 ' + _baTestData.bornAccessibleScoring.sections[i].sectionItems[j].itemScores['N/A'],
							checked: true
						}
					));
					has_default = true;
				}
				
				// add possible numeric scores
				for (var k = 0; k < 10; k++) {
					if (_baTestData.bornAccessibleScoring.sections[i].sectionItems[j].itemScores[k]) {
						fieldset.appendChild(createRadioInput(
							{
								name: _baTestData.bornAccessibleScoring.sections[i].sectionItems[j]['$itemId'],
								value: k,
								description: k + ' \u2014 ' + _baTestData.bornAccessibleScoring.sections[i].sectionItems[j].itemScores[k],
								checked: (!has_default && k == 0) ? true : false
							}
						));
					}
				}
				
				// add note field
				
				var note_div = document.createElement('div');
					note_div.setAttribute('class', 'ba_note');
				
				var note_label = document.createElement('span');
					note_label.appendChild(document.createTextNode('Notes:'));
				
				note_div.appendChild(note_label);
				
				var note_textarea = document.createElement('textarea');
					note_textarea.setAttribute('rows','3');
					note_textarea.setAttribute('cols','30');
				
				note_div.appendChild(note_textarea);
				
				fieldset.appendChild(note_div);
				
				section.appendChild(fieldset);
			}
				
			var score_div = document.createElement('div');
				score_div.setAttribute('class','ba-score');
			
			var score_span_label = document.createElement('span');
				score_span_label.setAttribute('class','ba-score-label');
				score_span_label.appendChild(document.createTextNode(_baTestData.bornAccessibleScoring.sections[i].sectionName + ' Score: '));
			
			score_div.appendChild(score_span_label);
			
			var score_span_value = document.createElement('span');
				score_span_value.setAttribute('id',_baTestData.bornAccessibleScoring.sections[i]['$sectionId']+'-score');
				score_span_value.setAttribute('class','ba-score-value');
				score_span_value.setAttribute('aria-live','polite');
				score_span_value.appendChild(document.createTextNode('0%'));
			
			score_div.appendChild(score_span_value);
			
			section.appendChild(score_div);
			
			_extension_tab.appendChild(section);
		}
			
		/* watch for scoring changes */
		$('section#born_accessible input[type="radio"]').click( function(){
			bornAccessible.updateSectionScore(this);
		});
	}
	
	
	function createRadioInput(options) {
		var label = document.createElement('label');
			label.setAttribute('class','ba_label');
		
		var input = document.createElement('input');
			input.setAttribute('type','radio');
			input.setAttribute('name',options.name);
			input.setAttribute('value',options.value);
			
		if (options.checked) {
			input.setAttribute('checked','checked');
		}
		
		label.appendChild(input);
		label.appendChild(document.createTextNode(' '));
		
		var span = document.createElement('span');
			span.setAttribute('class','radio-desc');
			span.appendChild(document.createTextNode(options.description));
		
		label.appendChild(span);
		
		return label;
	}
	
	function updateSectionScore(radio_button) {
		var parent_section = radio_button.closest('section');
		var test_fields = parent_section.getElementsByTagName('fieldset');
		var actual_score = 0;
		var total_score = 0;
		
		for (var i = 0; i < test_fields.length; i++) {
			var test_score = test_fields[i].querySelector('input:checked').value;
			
			if (test_score.toLowerCase() != 'n/a') {
				actual_score += Number(test_score);
				total_score += 4;
			}
		}
		
		var percentage_score = (total_score == 0) ? 0 : Math.round((actual_score / total_score) * 100);
		
		parent_section.querySelector('span.ba-score-value').textContent = percentage_score + '%';
	}
	
	
	function filterTests() {
		var filters = document.querySelectorAll('#born_accessible input.test-filter:checked');
		
		var scores = {};
		
		for (var i = 0; i < filters.length; i++) {
			scores[filters[i].value] = true;
		}
		
		var tests = document.querySelectorAll('#born_accessible fieldset.test');
		
		for (var i = 0; i < tests.length; i++) {
			var score = tests[i].querySelector('input:checked').value;
			tests[i].style.display = filters.length == 0 ? 'block' : (scores.hasOwnProperty(score) ? 'block' : 'none');
		}
	}
	
	
	return {
		initialize: function() {
			createBornAccessibleScoringTab();	
		},
		
		updateSectionScore: function(radio_button) {
			updateSectionScore(radio_button);
		},
		
		filterTests: function() {
			filterTests();
		}
	}

})();


/* load the tab */
window.onload = bornAccessible.initialize();

