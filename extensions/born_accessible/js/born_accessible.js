
'use strict';

/* 
 * 
 * bornAccessible
 * 
 * Functionality for generating and scoring a publication according to the
 * born accessible test criteria
 * 
 * Public functions:
 * 
 * - initialize - generates the scoring sections from the GCA_Consulting.json file
 * 
 * - updateSectionScore - called when a score is set/changed to update the overall score for that section
 * 
 * - filterTests - filters the visible scores based on user selection
 * 
*/


var bornAccessible = (function() {

	var _extension_tab = document.getElementById('born_accessible'); 
	var _MAX_SECTION_SCORE = 4;
	var _SCORE_TEXT_CSS = {
		0: 'err',
		1: 'alert',
		2: 'alert',
		3: 'alert',
		4: 'pass',
		'N/A': 'na',
		'Unverified': 'warn'
	}
	
	
	function generateBornAccessibleTab() {
		generateComplexity();
		generateDesignElements();
		generateTests();
		smartReport.setExtensionTabOutput('born_accessible',true);
	}
	

	function generateDesignElements() {
		
		var fieldset = document.createElement('fieldset');
			fieldset.setAttribute('id', 'ba-design-elements');
			fieldset.setAttribute('class', 'flat');
		
		var legend = document.createElement('legend');
			legend.appendChild(document.createTextNode('Design Elements:'))
		
		fieldset.appendChild(legend);
		
		var average = document.createElement('p');
			average.setAttribute('id','ba-epp');
		
		var average_num = document.createElement('span');
			average_num.setAttribute('id','ba-epp-num');
			average_num.appendChild(document.createTextNode('0'));
		
		average.appendChild(average_num);
		
		var average_label = document.createElement('span');
			average_label.appendChild(document.createTextNode(' per page'));
		
		average.appendChild(average_label);
		
		fieldset.appendChild(average);
		
		var info_section = _extension_tab.querySelector('#ba-content-inputs');
			info_section.insertBefore(fieldset,info_section.firstChild);
	}
	

	function generateComplexity() {
		
		var fieldset = document.createElement('fieldset');
			fieldset.setAttribute('id', gca.epubComplexity['$complexityId']);
			fieldset.setAttribute('class', 'flat');
		
		var legend = document.createElement('legend');
			legend.appendChild(document.createTextNode(gca.epubComplexity.complexityName+':'))
		
		fieldset.appendChild(legend);
		
		var definition_list = document.createElement('dl');
		
		for (var i = 0; i < gca.epubComplexity.complexityLevels.length; i++) {
			var definition_term = document.createElement('dt');
			
			var definition_label = document.createElement('label');
			
			var complexity_radio = document.createElement('input');
				complexity_radio.setAttribute('type','radio');
				complexity_radio.setAttribute('name','ba-complexity-level');
				complexity_radio.setAttribute('id',gca.epubComplexity.complexityLevels[i]['$levelId']);
				complexity_radio.setAttribute('value',gca.epubComplexity.complexityLevels[i].levelName);
				
			definition_label.appendChild(complexity_radio);
			definition_label.appendChild(document.createTextNode(' ' + gca.epubComplexity.complexityLevels[i].levelName));
			
			definition_term.appendChild(definition_label);
			
			definition_list.appendChild(definition_term);
				
			var definition_description = document.createElement('dd');
				definition_description.appendChild(document.createTextNode(gca.epubComplexity.complexityLevels[i].levelDescription));
			
			definition_list.appendChild(definition_description);
		}
		
		fieldset.appendChild(definition_list);
		
		var info_section = _extension_tab.querySelector('#ba-content-inputs');
			info_section.insertBefore(fieldset,info_section.firstChild);
	}
	
	
	function generateTests() {
		
		// generate a section for each group of tests
		
		for (var i = 0; i < gca.bornAccessibleScoring.sections.length; i++) {
			var section = document.createElement('section');
				section.setAttribute('id', gca.bornAccessibleScoring.sections[i]['$sectionId']);
				section.setAttribute('class','test');
			
			var section_number = (i+1) + '.';
			
			var hd = document.createElement('h4');
				hd.appendChild(document.createTextNode(section_number + ' ' + gca.bornAccessibleScoring.sections[i].sectionName));
			
			section.appendChild(hd);
			
			var test_div = document.createElement('div');
				test_div.setAttribute('class','tests')
			
			// create a fieldset for each each test
			
			for (var j = 0; j < gca.bornAccessibleScoring.sections[i].sectionItems.length; j++) {
				
				var fieldset = document.createElement('fieldset');
					fieldset.setAttribute('id',gca.bornAccessibleScoring.sections[i].sectionItems[j]['$itemId']);
					fieldset.setAttribute('class','test warn')
				
				var legend = document.createElement('legend');
					legend.setAttribute('id',gca.bornAccessibleScoring.sections[i].sectionItems[j]['$itemId']+'-legend')
					legend.appendChild(document.createTextNode(section_number + (j+1) + ' ' + gca.bornAccessibleScoring.sections[i].sectionItems[j].itemName));
				
				fieldset.appendChild(legend);
				
				// add default unverified value
				
				fieldset.appendChild(createRadioInput(
					{
						name: gca.bornAccessibleScoring.sections[i].sectionItems[j]['$itemId'],
						value: 'Unverified',
						description: 'Unverified',
						label: gca.bornAccessibleScoring.sections[i].sectionItems[j]['$itemId']+'-legend',
						checked: true
					}
				));
				
				// add possible scores
				
				for (var score in gca.bornAccessibleScoring.sections[i].sectionItems[j].itemScores) {
					fieldset.appendChild(createRadioInput(
						{
							name: gca.bornAccessibleScoring.sections[i].sectionItems[j]['$itemId'],
							value: score,
							description: score + ' \u2014 ' + gca.bornAccessibleScoring.sections[i].sectionItems[j].itemScores[score],
							label: gca.bornAccessibleScoring.sections[i].sectionItems[j]['$itemId']+'-legend'
						}
					));
				}
				
				// add note field
				
				var note_div = document.createElement('div');
					note_div.setAttribute('class', 'ba-note');
				
				var note_label = document.createElement('label');
				
				var note_hd = document.createElement('span');
					note_hd.appendChild(document.createTextNode('Notes:'));
				
				note_label.appendChild(note_hd);
				
				var note_textarea = document.createElement('textarea');
					note_textarea.setAttribute('rows','3');
					note_textarea.setAttribute('cols','30');
				
				note_label.appendChild(note_textarea);
				
				note_div.appendChild(note_label);
				
				fieldset.appendChild(note_div);
				
				test_div.appendChild(fieldset);
				
				if (gca.bornAccessibleScoring.sections[i].sectionItems[j].hasOwnProperty('wcagScoreFrom')) {
					for (var k = 0; k < gca.bornAccessibleScoring.sections[i].sectionItems[j]['wcagScoreFrom'].length; k++) {
						setWCAGEventHandler(gca.bornAccessibleScoring.sections[i].sectionItems[j]['$itemId'], gca.bornAccessibleScoring.sections[i].sectionItems[j]['wcagScoreFrom'][k], gca.bornAccessibleScoring.sections[i].sectionItems[j]['itemName']);
					}
				}
			}
			
			// add cumulative section score
			
			var score_div = document.createElement('div');
				score_div.setAttribute('class','ba-score');
			
			var score_span_label = document.createElement('span');
				score_span_label.setAttribute('class','ba-score-label');
				score_span_label.appendChild(document.createTextNode(gca.bornAccessibleScoring.sections[i].sectionName + ' Score: '));
			
			score_div.appendChild(score_span_label);
			
			var score_span_value = document.createElement('span');
				score_span_value.setAttribute('id',gca.bornAccessibleScoring.sections[i]['$sectionId']+'-score');
				score_span_value.setAttribute('class','ba-score-value');
				score_span_value.setAttribute('aria-live','polite');
			
			score_div.appendChild(score_span_value);
			
			test_div.appendChild(score_div);
			
			section.appendChild(test_div);
			
			// add the n/a alternative text to show when tests are excluded
			
			var na_div = document.createElement('div');
				na_div.setAttribute('class','not-applicable');
				na_div.appendChild(document.createTextNode('These tests have been disabled as the specified content was not found in the EPUB publication. To re-enable the tests, refer to the '));
			
			var link = document.createElement('a');
				link.setAttribute('href','#ba-test-exclusions');
				link.appendChild(document.createTextNode('content exclusion options'))
			
			na_div.appendChild(link);
			na_div.appendChild(document.createTextNode(' at the top of the tab.'));
			
			section.appendChild(na_div)
			
			_extension_tab.querySelector('section#ba-scoring').appendChild(section);
		}
		
		/* watch for scoring changes */
		$('section#born_accessible input.test-input').click( function(){
			bornAccessible.updateSectionScore(this);
			bornAccessible.setBackgroundStatus(this);
			bornAccessible.updateResultScore();
		});
	}
	
	
	function setWCAGEventHandler(gcaID, wcagID, testName) {
	
		$('input.sc_status[name="' + wcagID + '"]').click( function() {
		
			var current_ba_status = document.querySelector('fieldset#' + gcaID + ' input.test-input:checked').value;
			
			if (current_ba_status != 'Unverified') {
				if ((this.value == 'fail' && String(current_ba_status) == '0') || (this.value == 'pass' && String(current_ba_status) == _MAX_SECTION_SCORE)) {
					return;
				}
			
				else if (!confirm('The related Born Accessible test "' + testName + '" has already been set to ' + (current_ba_status == 0 ? 'fail' : (current_ba_status == _MAX_SECTION_SCORE ? 'pass' : 'to a different value')) + '.\n\nClick Ok to override or Cancel to leave as is.')) {
					return;
				}
			}
			
			if (this.value == 'pass') {
				document.querySelector('fieldset#' + gcaID + ' input.test-input[value="' + _MAX_SECTION_SCORE + '"]').click(); 
			}
			
			else if (this.value == 'fail') {
				document.querySelector('fieldset#' + gcaID + ' input.test-input[value="0"]').click(); 
			}
		});
	}
	
	
	function createRadioInput(options) {
		var label = document.createElement('label');
			label.setAttribute('class','ba-label');
		
		var input = document.createElement('input');
			input.setAttribute('type','radio');
			input.setAttribute('name',options.name);
			input.setAttribute('value',options.value);
			input.setAttribute('aria-labelledby',options.label);
			input.setAttribute('class','test-input');
		
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
	
	
	function generateResult() {
		var config = {
			label: 'Born Accessible Score:',
			default: 'Incomplete',
			score_id: 'ba_final_score_status',
			value_id: 'ba_final_score' // currently don't care about this field
		};
		smartReport.addExtensionResult(config);
	}
	
	
	function updateResultScore() {
		var incomplete = document.querySelector('#born_accessible section.test input[value="Unverified"]:checked');
		
		var test_scores = document.querySelectorAll('#born_accessible section.test input:checked');
		
		var max_score = 0;
		var actual_score = 0;
		
		for (var i = 0; i < test_scores.length; i++) {
			if (!test_scores[i].value.match(/^[0-9]+$/)) {
				continue;
			}
			actual_score += Number(test_scores[i].value);
			max_score += _MAX_SECTION_SCORE;
		}
		
		var total_score = (max_score == 0) ? 'N/A' : (Math.round((actual_score / max_score) * 100) + '%');
	}
	
	
	function updateSectionScore(radio_button) {
		var parent_section = radio_button.closest('section');
		var test_fields = parent_section.getElementsByTagName('fieldset');
		var actual_score = 0;
		var total_score = 0;
		var isNA = true;
		
		for (var i = 0; i < test_fields.length; i++) {
			var test_score = test_fields[i].querySelector('input:checked');
			
			if (test_score && test_score.value.toLowerCase() != 'n/a') {
				actual_score += Number(test_score.value);
				total_score += _MAX_SECTION_SCORE;
				isNA = false;
			}
		}
		
		var display_score = 'N/A';
		
		if (!isNA) {
			display_score = (total_score == 0) ? 0 : Math.round((actual_score / total_score) * 100) + '%';
		}
		
		parent_section.querySelector('span.ba-score-value').textContent = display_score;
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
				if (filters.length == 0 || scores.hasOwnProperty(score.value)) {
					tests[i].classList.remove('hidden');
				}
				else {
					tests[i].classList.add('hidden');
				}
			}
			else {
				if (filters.length == 0 || scores.hasOwnProperty('none')) {
					tests[i].classList.remove('hidden');
				}
				else {
					tests[i].classList.add('hidden');
				}
			}
		}
	}
	
	
	function configureContentTypeTests(options) {
		if (!options || typeof(options) !== 'object') {
			return;
		}
		
		if (!options.hasOwnProperty('type') || !options.type) {
			return;
		}
		
		var test_section = document.getElementById('section-'+options.type);
		
		if (test_section) {
		
			// show/hide the tests
			if (options.exclude) {
				test_section.querySelector('div.tests').classList.add('hidden');
				test_section.querySelector('div.not-applicable').classList.add('visible');
			}
			else {
				test_section.querySelector('div.tests').classList.remove('hidden');
				test_section.querySelector('div.not-applicable').classList.remove('visible');
			}
			
			if (options.exclude) {
				// set all the tests to n/a
				var tests = test_section.querySelectorAll('fieldset.test');
				
				for (var i = 0; i < tests.length; i++) {
					tests[i].querySelector('input[value="N/A"]').click();
				}
			}
		}
	}
	
	
	return {
		initialize: function() {
			generateBornAccessibleTab();
		},
		
		updateSectionScore: function(radio_button) {
			updateSectionScore(radio_button);
		},
		
		filterTests: function() {
			filterTests();
		},
		
		configureContentTypeTests: function(options) {
			configureContentTypeTests(options);
		},
		
		setExcludedTests: function(JSON) {
			setExcludedTests(JSON);
		},
		
		setBackgroundStatus: function(test_input) {
			var fieldset = test_input.closest('fieldset');
				fieldset.classList.remove('na', 'err', 'alert', 'warn', 'pass');
				fieldset.classList.add(_SCORE_TEXT_CSS[test_input.value]);
		},
		
		updateResultScore: function() {
			updateResultScore();
		}
	}

})();


/* load the tab */
window.onload = bornAccessible.initialize();


/*
 * Event Handlers
 */

/* watch for output state changes */
$('section#born_accessible input#ba-output-report').click(function() {
	smartReport.setExtensionTabOutput('born_accessible',this.checked);
});

/* watch for filter changes */
$('section#born_accessible input.test-filter').click(function() {
	bornAccessible.filterTests();
});

/* watch for content type exclusions */
$('section#born_accessible input.ba-excl-test').click(function() {
	bornAccessible.configureContentTypeTests({type: this.value, exclude: this.checked});
});
