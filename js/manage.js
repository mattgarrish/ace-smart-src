
var manage = new Manage();

function Manage() {
	this.LOCAL_STORAGE = hasLocalStorage();
	if (!this.LOCAL_STORAGE) {
		document.getElementById('local-na').removeAttribute('hidden');
		document.querySelector('input[name="save"][value="saved"]').click();
		document.querySelector('input[name="save"][value="storage"]').disabled = true;
		document.querySelector('input[name="load"][value="saved"]').click();
		document.querySelector('input[name="load"][value="storage"]').disabled = true;
	}
}


Manage.prototype.openSave = function() {
	save_dialog.dialog('open');
}


Manage.prototype.openLoad = function() {
	load_dialog.dialog('open');
}


Manage.prototype.saveConformanceReport = function() {

	var sc = document.querySelectorAll('.a, .aa, .aaa, .epub');
	
	var reportJSON = '{';
	
	reportJSON += '"version": "1.0",'
	reportJSON += '"created": "' + format.generateTimestamp('dash') + '",'
	
	/* store configuration info */
	
	reportJSON += '"config": {';
		reportJSON += '"wcag": {';
			reportJSON += '"level": ' + JSON.stringify(document.querySelector('input[name="wcag-level"]:checked').value) + ',';
			reportJSON += '"show_aa": ' + (document.getElementById('show-aa').checked ? 'true' : 'false') + ',';
			reportJSON += '"show_aaa": ' + (document.getElementById('show-aaa').checked ? 'true' : 'false') + '';
		reportJSON += '},';
	
		/* store pub info */
		
		reportJSON += '"title": ' + JSON.stringify(document.getElementById('title').value) + ',';
		reportJSON += '"creator": ' + JSON.stringify(document.getElementById('creator').value) + ',';
		reportJSON += '"identifier": ' + JSON.stringify(document.getElementById('identifier').value) + ',';
		reportJSON += '"modified": ' + JSON.stringify(document.getElementById('modified').value) + ',';
		reportJSON += '"publisher": ' + JSON.stringify(document.getElementById('publisher').value) + ',';
		reportJSON += '"date": ' + JSON.stringify(document.getElementById('date').value) + ',';
		reportJSON += '"description": ' + JSON.stringify(document.getElementById('description').value) + ',';
		reportJSON += '"subject": ' + JSON.stringify(document.getElementById('subject').value) + ',';
		reportJSON += '"optional-meta": ' + JSON.stringify(document.getElementById('optional-meta').value) + ',';
		
		/* store original report data section */
		
		reportJSON += '"report": ' + JSON.stringify(document.getElementById('report').value) + ',';
		
		/* other config info */
		reportJSON += '"epub_format": ' + JSON.stringify(document.querySelector('input[name="epub-format"]:checked').value);
		
		var excl = document.querySelectorAll('#exclusions input[type="checkbox"]:not(:checked)');
		if (excl.length > 0) {
			reportJSON += ',"exclusions": [';
				for (var k = 0; k < excl.length; k++) {
				   reportJSON += JSON.stringify(excl[k].value);
				   reportJSON += (k == excl.length-1) ? '' : ',';
				}
			reportJSON += ']';
		}
	reportJSON += '},';

	/* store success criteria state */
	
	reportJSON += '"conformance": [';
	
		for (var i = 0; i < sc.length; i++) {
			
			var status = document.querySelector('input[name="'+sc[i].id+'"]:checked').value;
			
			reportJSON += '{"sc": "' + sc[i].id + '", "status": "' + status + '"';
			
			if (status == 'fail') {
				reportJSON += ', "error": ' + JSON.stringify(document.getElementById(sc[i].id+'-err').value);
			}
			
			if ((document.getElementsByName(sc[i].id+'-note'))[0].checked) {
				reportJSON += ', "note": ' + JSON.stringify(document.getElementById(sc[i].id+'-info').value);
			}
			
			reportJSON += '}';
			reportJSON += (i == (sc.length-1)) ? '' : ',';
		}
	
	reportJSON += '],';
	
	/* store discovery metadata */
	
	reportJSON += '"discovery": {'
	
		var fields = new Array('accessibilityFeature','accessibilityHazard','accessMode','accessibilityAPI','accessibilityControl');
		
		fields.forEach( function(id) {
			reportJSON += manage.saveDiscoveryMeta(id);
		});
		
		reportJSON += '"accessibilitySummary": ' + JSON.stringify(document.getElementById('accessibilitySummary').value) + ',';
		reportJSON += '"accessModeSufficient": {';
			reportJSON += this.saveSufficientSets();
		reportJSON += '}';
	
	reportJSON += '},';
	
	/* store conformance metadata */
	
	reportJSON += '"conformanceMeta": {'
		reportJSON += '"result": ' + JSON.stringify(document.querySelector('input[name="conf-result"]:checked').value) + ',';
		reportJSON += '"certifier": ' + JSON.stringify(document.getElementById('certifier').value) + ',';
		
		var cNum = document.querySelectorAll('fieldset.credential').length;
		
		for (var i = 1; i <= cNum; i++) {
			reportJSON += '"credential' + i + '": {';
				reportJSON += '"name": ' + JSON.stringify(document.getElementById('credentialName'+i).value) + ',';
				reportJSON += '"link": ' + JSON.stringify(document.getElementById('credentialLink'+i).value);
			reportJSON += '},';
		}
		
		reportJSON += '"reportLink": ' + JSON.stringify(document.getElementById('reportLink').value);

	reportJSON += '}';
	
	/* close object */
	reportJSON += '}';
	
	if (document.querySelector('input[name="save"][value="storage"]:checked')) {
   		try {
			if (localStorage.getItem('epubA11YReport')) {
				if (!confirm('Local storage already contains a saved report. Click Ok to overwrite.')) {
					return;
				}
			}
			localStorage.setItem('epubA11YReport',reportJSON);
   		}
   		catch (e) {
   			alert('Failed to save report:\n\n'+e);
   			return;
   		}
   		alert('Report successfully saved to local storage.');
	}
	
	else {
		this.writeSavedJSON(reportJSON);
	}
	
	save_dialog.dialog('close');
}



Manage.prototype.saveDiscoveryMeta = function(id) {
	var str = '';
	var checked = document.querySelectorAll('fieldset#' + id + ' input:checked');
	
	if (checked.length > 0) {
		str += '"' + id + '": [';
		for (var i = 0; i< checked.length; i++) {
			str += JSON.stringify(checked[i].value);
			str += (i == checked.length-1) ? '' : ',';
		}
		str += '],';
	}
	
	return str;
}



Manage.prototype.saveSufficientSets = function(id) {
	var str = '';
	
	var sets = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset');
	
	for (var i = 0; i < sets.length; i++) {
		var modes = sets[i].querySelectorAll('input:checked');
		
		if (modes.length > 0) {
			str += (i == 0) ? '' : ',';
			str += '"set' + i +'": [';
				for (var j = 0; j < modes.length; j++) {
					str += JSON.stringify(modes[j].value);
					str += (j == modes.length - 1) ? '' : ','; 
				}
			str += ']';
		}
	}
	
	return str;
}




Manage.prototype.writeSavedJSON = function(reportJSON) {
	var jsonWin = window.open('json.html','jsonWin');
		jsonWin.addEventListener('load', function() { jsonWin.init(reportJSON); });
}



Manage.prototype.clearSaved = function() {
	if (confirm('WARNING: this operation will permanently delete any saved results. Click Ok to continue or Cancel to exit.')) {
		localStorage.removeItem('epubA11YReport');
	}
}



Manage.prototype.loadConformanceReport = function() {

	var reportData = '';
	
	if (document.querySelector('input[name="load"][value="storage"]:checked')) {
		reportData = localStorage.getItem('epubA11YReport');
	}
	
	else {
		reportData = document.getElementById('savedReport').value.trim();
	}
	
	if (reportData === null || reportData == '') {
		alert('Load failed. No data found.');
		return;
	}
	
	if (!confirm('This action will delete any current reporting data and cannot be undone. Click Ok to continue.')) {
		return;
	}
	
	this.clear(true);
	
	var report_obj;
	
	try {
		report_obj = JSON.parse(reportData);
	}
	
	catch (e) {
		alert('Failed to load report.\n\n' + e); 
		return;
	}
	
	/* save out the original report data and reset the form to match */
	if (report_obj.hasOwnProperty(report)) {
		document.getElementById('report').value = JSON.stringify(report_obj['report']);
		ace.storeReport(report_obj['report']);
		ace.configureReporting();
	}
	
	/* load SCs */
	
	for (var i = 0; i < report_obj.conformance.length; i++) {
		document.querySelector('input[name="'+report_obj.conformance[i].sc+'"][value="'+ report_obj.conformance[i].status + '"]').click();
		
		if (report_obj.conformance[i].hasOwnProperty('error')) {
			document.getElementById(report_obj.conformance[i].sc+'-err').value = report_obj.sc[i].error;
		}
		
		if (report_obj.conformance[i].hasOwnProperty('note')) {
			document.querySelector('input[name="'+report_obj.conformance[i].sc+'-note"]').click();
			document.getElementById(report_obj.conformance[i].sc+'-info').value = report_obj.conformance[i].note;
		}
	}
	
	/* load discovery metadata */
	
	var disc_chk = ['accessibilityFeature','accessibilityHazard','accessMode','accessibilityAPI','accessibilityControl'];
	
	disc_chk.forEach(function(id) {
		if (report_obj.discovery.hasOwnProperty(id)) {
			manage.loadDiscoveryMeta(id,report_obj.discovery[id]);
		}
	})
	
	if (report_obj.discovery.hasOwnProperty('accessibilitySummary')) {
		document.getElementById('accessibilitySummary').value = report_obj.discovery.accessibilitySummary;
	}
	
	if (report_obj.discovery.hasOwnProperty('accessModeSufficient')) {
		this.loadSufficientModes(report_obj.discovery.accessModeSufficient);
	}
	
	/* load conformance and config text fields */
	
	var meta = {"conformanceMeta": ['certifier','reportLink'], "config": ['title','creator','identifier','modified','publisher','description','date','subject','optional-meta']};
	
	for (var key in meta) {
		meta[key].forEach(function(id) {
			document.getElementById(id).value = report_obj[key][id];
		})
	}
	
	document.querySelector('input[name=conf-result][value="' + report_obj.conformanceMeta.result + '"]').click();
	
	/* load credentials */
	
	for (var i = 1; i < 25; i++) {
		if (report_obj["conformanceMeta"].hasOwnProperty("credential"+i)) {
			if (i > 1) {
				conf_meta.addCredential();
			}
			document.getElementById('credentialName'+i).value = report_obj['conformanceMeta']['credential'+i]['name'];
			document.getElementById('credentialLink'+i).value = report_obj['conformanceMeta']['credential'+i]['link'];
		}
		else {
			break;
		}
	}
	
	/* load config */
	
	document.querySelector('input[name="wcag-level"][value="' + report_obj.config.wcag.level + '"]').click();
	
	if (report_obj.config.wcag.show_aa && report_obj.config.wcag.level != 'aa') {
		document.getElementById('show-aa').click();
	}
	
	if (report_obj.config.wcag.show_aaa) {
		document.getElementById('show-aaa').click();
	}
	
	document.querySelector('input[name="epub-format"][value="' + report_obj.config.epub_format + '"]').click();
	
	if (report_obj.config.hasOwnProperty('exclusions')) {
		var excl = document.getElementById('exclusions');
		report_obj.config.exclusions.forEach(function(val) {
		   excl.querySelector('input[value="' + val + '"]').click(); 
		});
	}
	
	alert('Report successfully loaded!');
	
	load_dialog.dialog('close');
}



Manage.prototype.loadDiscoveryMeta = function(id,obj) {
	for (var i = 0; i < obj.length; i++) {
		var chkbox = document.querySelector('#' + id + ' input[value="' + obj[i] + '"]');
		if (chkbox == null) {
			if (id == 'features') {
				disc.addCustomFeature(obj[i]);
			}
		}
		else {
			chkbox.click();
		}
	}
}



Manage.prototype.loadSufficientModes = function(modeSets) {
	/* add any additional sets before loading */
	var setNum = Object.keys(modeSets).length;
	if (setNum > 2) {
		for (var j = 1; j <= setNum - 2; j++) {
			disc.addSufficient();
		}
	}
	
	var sets = document.querySelectorAll('#accessModeSufficient fieldset');
	
	var num = 0;
	for (var key in modeSets) {
		modeSets[key].forEach(function(val) {
			sets[num].querySelector('input[value="' + val + '"]').click();
		});
		num += 1;
	}
}


Manage.prototype.clear = function(quiet) {
	
	if (!quiet && !confirm('WARNING: All currently entered data will be deleted. This operation cannot be undone.\n\nClick Ok to continue or Cancel to exit.')) {
		return;
	}
	
	/* clear all forms */
	var forms = document.forms;
	
	for (var x = 0; x < forms.length; x++) {
		forms[x].reset();
	}
	
	/* clear artefacts from the conformance checks */
	var sc_elem = document.querySelectorAll('.a, .aa, .aaa, .epub');
	
	for (var i = 0; i < sc_elem.length; i++) {
		// reset the status to remove background colours
		document.querySelector('input[name="' + sc_elem[i].id + '"][value="unverified"]').click();
		
		// click the notes twice because reset removes check without hiding note
		var note = document.querySelector('input[name="' + sc_elem[i].id + '-note"]');
			note.click();
			note.click();
	}
	
	/* clear artefacts from the discovery metadata */
	var disc_elem = document.querySelectorAll('#discovery fieldset');
	
	for (var i = 0; i < disc_elem.length; i++) {
		disc_elem[i].classList.remove(format.BG.ERR, format.BG.WARN, format.BG.PASS, format.BG.NA);
		var custom = disc_elem[i].getElementsByClassName('custom');
		for (var j = 0; j < custom.length; j++) {
			custom[j].parentNode.removeChild(custom[j]);
		}
	}
	
	/* clear artefacts from config */
	document.getElementById('title').classList.remove(format.BG.ERR);
	document.getElementById('modified').classList.remove(format.BG.ERR);
	
	error.clearAll();
	error.hide();
}



Manage.prototype.setSavedReport = function () {
	var data_elem = document.getElementById('savedReportOpt');
	if (!data_elem.checked) {
		data_elem.click();
	}
}



function hasLocalStorage() {
	try {
		localStorage.setItem('test','1');
		localStorage.removeItem('test');
		return true;
	}
	catch(e) {
		return false;
	}
}
