
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
		generateTests();
		smartReport.setExtensionTabOutput('born_accessible',true);
	}
	
	
	function generateComplexity() {
		var fieldset = document.createElement('fieldset');
			fieldset.setAttribute('id', _baTestData.epubComplexity['$complexityId']);
			fieldset.setAttribute('class', 'flat');
		
		var legend = document.createElement('legend');
			legend.appendChild(document.createTextNode(_baTestData.epubComplexity.complexityName+':'))
		
		fieldset.appendChild(legend);
		
		var definition_list = document.createElement('dl');
		
		for (var i = 0; i < _baTestData.epubComplexity.complexityLevels.length; i++) {
			var definition_term = document.createElement('dt');
			
			var definition_label = document.createElement('label');
			
			var complexity_radio = document.createElement('input');
				complexity_radio.setAttribute('type','radio');
				complexity_radio.setAttribute('name','ba-complexity-level');
				complexity_radio.setAttribute('id',_baTestData.epubComplexity.complexityLevels[i]['$levelId']);
				complexity_radio.setAttribute('value',_baTestData.epubComplexity.complexityLevels[i].levelName);
				
			definition_label.appendChild(complexity_radio);
			definition_label.appendChild(document.createTextNode(' ' + _baTestData.epubComplexity.complexityLevels[i].levelName));
			
			definition_term.appendChild(definition_label);
			
			definition_list.appendChild(definition_term);
				
			var definition_description = document.createElement('dd');
				definition_description.appendChild(document.createTextNode(_baTestData.epubComplexity.complexityLevels[i].levelDescription));
			
			definition_list.appendChild(definition_description);
		}
		
		fieldset.appendChild(definition_list);
		
		_extension_tab.querySelector('#ba-content-inputs').appendChild(fieldset);
	}
	
	
	function generateTests() {
		
		for (var i = 0; i < _baTestData.bornAccessibleScoring.sections.length; i++) {
			var section = document.createElement('section');
				section.setAttribute('id', _baTestData.bornAccessibleScoring.sections[i]['$sectionId']);
				section.setAttribute('class','test');
			
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
							description: 'N/A' + ' \u2014 ' + _baTestData.bornAccessibleScoring.sections[i].sectionItems[j].itemScores['N/A']
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
								description: k + ' \u2014 ' + _baTestData.bornAccessibleScoring.sections[i].sectionItems[j].itemScores[k]
							}
						));
					}
				}
				
				// add note field
				
				var note_div = document.createElement('div');
					note_div.setAttribute('class', 'ba-note');
				
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
			label.setAttribute('class','ba-label');
		
		var input = document.createElement('input');
			input.setAttribute('type','radio');
			input.setAttribute('name',options.name);
			input.setAttribute('value',options.value);
			
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
			var test_score = test_fields[i].querySelector('input:checked');
			
			if (test_score && test_score.value.toLowerCase() != 'n/a') {
				actual_score += Number(test_score.value);
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
			var score = tests[i].querySelector('input:checked');
			if (score) {
				tests[i].style.display = filters.length == 0 ? 'block' : (scores.hasOwnProperty(score.value) ? 'block' : 'none');
			}
			else {
				tests[i].style.display = filters.length == 0 ? 'block' : (scores.hasOwnProperty('none') ? 'block' : 'none');
			}
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

