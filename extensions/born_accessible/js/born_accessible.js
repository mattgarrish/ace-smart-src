
var ba = new BornAccessible();

function BornAccessible() {
	this.tests = '';
}

BornAccessible.prototype.getTests = function() {
	$.ajax(
	{
		url: 'extensions/born_accessible/js/tests.json',
		data: {
			format: 'json'
		},
		dataType:		'json',
		cache:			false,
		success: function( data )
		{
			ba.loadTests(data);
		},
		error: function()
		{
			alert( 'Error loading born accessible tests.' );
		}
	});
}


BornAccessible.prototype.loadTests = function(json) {
	
	this.tests = json;
	
	var tab = document.getElementById('born_accessible'); 
	
	for (var key in this.tests) {
		if (this.tests.hasOwnProperty(key)) {
			var section = document.createElement('section');
				section.setAttribute('id', key);
			
			var hd = document.createElement('h4');
				hd.appendChild(document.createTextNode(this.tests[key].title));
			
			section.appendChild(hd);
			
			for (var i = 0; i < this.tests[key].tests.length; i++) {
				var fieldset = document.createElement('fieldset');
					fieldset.setAttribute('id',this.tests[key].tests[i].id);
				
				var legend = document.createElement('legend');
					legend.appendChild(document.createTextNode(this.tests[key].tests[i].title));
				
				fieldset.appendChild(legend);
				
				// add n/a as default
				fieldset.appendChild(this.createRadioScore(key, this.tests[key].tests[i].id, -1, 'N/A', true));
				
				// add possible scores
				for (var j = 0; j < this.tests[key].tests[i].scores.length; j++) {
					fieldset.appendChild(this.createRadioScore(key, this.tests[key].tests[i].id, this.tests[key].tests[i].scores[j], this.tests[key].tests[i].scores[j], false));
				}
				
				section.appendChild(fieldset);
			}
				
			var score_div = document.createElement('div');
				score_div.setAttribute('class','ba-score');
			
			var score_span_label = document.createElement('span');
				score_div.setAttribute('class','ba-score-label');
				score_span_label.appendChild(document.createTextNode('Score:'));
			
			score_div.appendChild(score_span_label);
			
			var score_span_value = document.createElement('span');
				score_span_value.setAttribute('id',key+'-score');
				score_span_value.setAttribute('class','ba-score-value');
				score_span_value.setAttribute('aria-live','polite');
				score_span_value.appendChild(document.createTextNode('0%'));
			
			score_div.appendChild(score_span_value);
			
			section.appendChild(score_div);
			
			tab.appendChild(section);
		}
	}
}


BornAccessible.prototype.createRadioScore = function(parent, name, score, title, checked) {
	var label = document.createElement('label');
		label.setAttribute('class','ba_score');
	
	var input = document.createElement('input');
		input.setAttribute('type','radio');
		input.setAttribute('name',name);
		input.setAttribute('value',score);
		input.setAttribute('onclick','ba.setScore("' + parent + '", this);');
		
	if (checked) {
		input.setAttribute('checked','checked');
	}
	
	label.appendChild(input);
	label.appendChild(document.createTextNode(' '));
	label.appendChild(document.createTextNode(title));
	
	return label;
}

window.onload = ba.getTests();
