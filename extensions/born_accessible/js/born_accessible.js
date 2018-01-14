
'use strict';

/* 
 * 
 * bornAccessible
 * 
 * Functionality for the born accessible extension tab
*/

var bornAccessible = (function() {
	var _baTestData = '';
	
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
				generateTests();
				
			},
			error: function()
			{
				alert('Failed to load born accessible test data.' );
			}
		});
	}
	
	
	function generateTests() {
		
		var tab = document.getElementById('born_accessible'); 
		
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
				
				var legend = document.createElement('legend');
					legend.appendChild(document.createTextNode(section_number + (j+1) + ' ' + _baTestData.bornAccessibleScoring.sections[i].sectionItems[j].itemName));
				
				fieldset.appendChild(legend);
				
				// add default NA value
				
				var has_default = false;
				
				if (_baTestData.bornAccessibleScoring.sections[i].sectionItems[j].itemScores.hasOwnProperty('N/A')) {
					fieldset.appendChild(createRadioScore(
						{
							name: _baTestData.bornAccessibleScoring.sections[i].sectionItems[j]['$itemId'],
							score: 'N/A',
							title: 'N/A' + ' \u2014 ' + _baTestData.bornAccessibleScoring.sections[i].sectionItems[j].itemScores['N/A'],
							checked: true
						}
					));
					has_default = true;
				}
				
				// add possible numeric scores
				for (var k = 0; k < 10; k++) {
					if (_baTestData.bornAccessibleScoring.sections[i].sectionItems[j].itemScores[k]) {
						fieldset.appendChild(createRadioScore(
							{
								name: _baTestData.bornAccessibleScoring.sections[i].sectionItems[j]['$itemId'],
								score: k,
								title: k + ' \u2014 ' + _baTestData.bornAccessibleScoring.sections[i].sectionItems[j].itemScores[k],
								checked: (!has_default && k == 0) ? true : false
							}
						));
					}
				}
				
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
			
			tab.appendChild(section);
		}
			
		/* watch for scoring changes */
		$('section#born_accessible input[type="radio"]').click( function(){
			bornAccessible.updateSectionScore(this);
		});
	}
	
	
	function createRadioScore(options) {
		var label = document.createElement('label');
			label.setAttribute('class','ba_score');
		
		var input = document.createElement('input');
			input.setAttribute('type','radio');
			input.setAttribute('name',options.name);
			input.setAttribute('value',options.score);
			
		if (options.checked) {
			input.setAttribute('checked','checked');
		}
		
		label.appendChild(input);
		label.appendChild(document.createTextNode(' '));
		
		var span = document.createElement('span');
			span.setAttribute('class','test-desc');
			span.appendChild(document.createTextNode(options.title));
		
		label.appendChild(span);
		
		return label;
	}
	
	function updateSectionScore(radio_button) {
		var parent_section = radio_button.closest('section');
		var test_fields = parent_section.querySelectorAll('fieldset');
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
	
	return {
		initialize: function() {
			createBornAccessibleScoringTab();	
		},
		
		updateSectionScore: function(radio_button) {
			updateSectionScore(radio_button);
		}
	}

})();


/* load the tab */
window.onload = bornAccessible.initialize();

