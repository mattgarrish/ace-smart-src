
'use strict';

var smartManage = (function(smartFormat,smartError,smartAce,smartConformance) {
	
	function saveConformanceReport() {
	
		var sc = document.querySelectorAll('.a, .aa, .aaa, .epub');
		
		var reportJSON = {};
		
		reportJSON.version = '1.0';
		reportJSON.aceFlag = 'savedReport';
		reportJSON.created = smartFormat.generateTimestamp('dash');
		
		/* store configuration info */
		
		reportJSON.config = {};
			reportJSON.config.wcag = {};
				reportJSON.config.wcag.level = document.querySelector('input[name="wcag-level"]:checked').value;
				reportJSON.config.wcag.show_aa = (document.getElementById('show-aa').checked ? 'true' : 'false');
				reportJSON.config.wcag.show_aaa = (document.getElementById('show-aaa').checked ? 'true' : 'false');
		
			/* store pub info */
			
			reportJSON.config.title = document.getElementById('title').value;
			reportJSON.config.creator = document.getElementById('creator').value;
			reportJSON.config.identifier = document.getElementById('identifier').value;
			reportJSON.config.modified = document.getElementById('modified').value;
			reportJSON.config.publisher = document.getElementById('publisher').value;
			reportJSON.config.date = document.getElementById('date').value;
			reportJSON.config.description = document.getElementById('description').value;
			reportJSON.config.subject = document.getElementById('subject').value;
			reportJSON.config['optional-meta'] = document.getElementById('optional-meta').value;
			
			/* store original report data section */
			
			reportJSON.config.report = document.getElementById('report').value;
			
			/* other config info */
			reportJSON.config.epub_format = document.querySelector('input[name="epub-format"]:checked').value;
			
			var excl = document.querySelectorAll('#exclusions input[type="checkbox"]:checked');
			if (excl.length > 0) {
				reportJSON.config.exclusions = [];
					for (var k = 0; k < excl.length; k++) {
					   reportJSON.config.exclusions.push(excl[k].value);
					}
			}
	
		/* store success criteria state */
		
		reportJSON.conformance = [];
		
			for (var i = 0; i < sc.length; i++) {
				
				var status = document.querySelector('input[name="'+sc[i].id+'"]:checked').value;
				
				reportJSON.conformance[i] = {};
				reportJSON.conformance[i].sc = sc[i].id;
				reportJSON.conformance[i].status = status;
				
				if (status == 'fail') {
					reportJSON.conformance[i].error = document.getElementById(sc[i].id+'-err').value;
				}
				
				if ((document.getElementsByName(sc[i].id+'-note'))[0].checked) {
					reportJSON.conformance[i].note = document.getElementById(sc[i].id+'-info').value;
				}
			}
		
		/* store discovery metadata */
		
		reportJSON.discovery = {};
		
			var fields = new Array('accessibilityFeature','accessibilityHazard','accessMode','accessibilityAPI','accessibilityControl');
			
			fields.forEach( function(id) {
				reportJSON.discovery[id] = saveDiscoveryMeta(id);
			});
			
			reportJSON.discovery.accessibilitySummary = document.getElementById('accessibilitySummary').value;
			reportJSON.discovery.accessModeSufficient = saveSufficientSets();
		
		/* store conformance metadata */
		
		reportJSON.conformanceMeta = {};
		
			reportJSON.conformanceMeta.result = document.getElementById('conf-result').value;
			
			reportJSON.conformanceMeta.certifiedBy = document.getElementById('certifiedBy').value;
			
			reportJSON.conformanceMeta.credential = {};
				reportJSON.conformanceMeta.credential.name = document.getElementById('credentialName').value;
				reportJSON.conformanceMeta.credential.link = document.getElementById('credentialLink').value;
			
			reportJSON.conformanceMeta.certifierReport = document.getElementById('certifierReport').value;
		
		/* store extension data */
		
		if (Object.keys(extension).length > 0) {
			for (var key in extension) {
				reportJSON += extension[key].saveData();
			}
		}
		
		writeSavedJSON(JSON.stringify(reportJSON));
	}
	
	
	
	function saveDiscoveryMeta(id) {
		var metaArray = [];
		var checked = document.querySelectorAll('fieldset#' + id + ' input:checked');
		
		if (checked.length > 0) {
			for (var i = 0; i< checked.length; i++) {
				metaArray.push(checked[i].value);
			}
		}
		
		return metaArray;
	}
	
	
	
	function saveSufficientSets(id) {
		var suffSets = {};
		
		var sets = document.getElementById('accessModeSufficient').getElementsByTagName('fieldset');
		
		for (var i = 0; i < sets.length; i++) {
			var modes = sets[i].querySelectorAll('input:checked');
			
			if (modes.length > 0) {
				suffSets['set'+i] = [];
					for (var j = 0; j < modes.length; j++) {
						suffSets['set'+i].push(modes[j].value);
					}
			}
		}
		
		return suffSets;
	}
	
	
	
	
	function writeSavedJSON(reportJSON) {
		var jsonWin = window.open('saved-evaluation.html','jsonWin');
			jsonWin.addEventListener('load', function() { jsonWin.init(reportJSON); });
	}
	
	
	
	function clearSaved() {
		if (confirm('WARNING: this operation will permanently delete any saved results. Click Ok to continue or Cancel to exit.')) {
			localStorage.removeItem('epubA11YReport');
		}
	}
	
	
	function loadConformanceReport(reportData) {
	
		if (reportData === null || reportData == '') {
			alert('Load failed. No data found.');
			return;
		}
		
		if (!confirm('This action will delete any current reporting data and cannot be undone. Click Ok to continue.')) {
			return;
		}
		
		clear(true);
		
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
			var ace = new Ace();
			smartAce.storeReport(report_obj['report']);
			smartAce.configureReporting();
		}
		
		/* load SCs */
		
		for (var i = 0; i < report_obj.conformance.length; i++) {
			document.querySelector('input[name="'+report_obj.conformance[i].sc+'"][value="'+ report_obj.conformance[i].status + '"]').click();
			
			if (report_obj.conformance[i].hasOwnProperty('error')) {
				document.getElementById(report_obj.conformance[i].sc+'-err').value = report_obj.conformance[i].error;
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
				loadDiscoveryMeta(id,report_obj.discovery[id]);
			}
		})
		
		if (report_obj.discovery.hasOwnProperty('accessibilitySummary')) {
			document.getElementById('accessibilitySummary').value = report_obj.discovery.accessibilitySummary;
		}
		
		if (report_obj.discovery.hasOwnProperty('accessModeSufficient')) {
			loadSufficientModes(report_obj.discovery.accessModeSufficient);
		}
		
		/* load conformance and config text fields */
		
		var meta = {"conformanceMeta": ['certifiedBy','certifierReport'], "config": ['title','creator','identifier','modified','publisher','description','date','subject','optional-meta']};
		
		for (var key in meta) {
			meta[key].forEach(function(id) {
				document.getElementById(id).value = report_obj[key][id];
			})
		}
		
		if (report_obj.conformanceMeta.hasOwnProperty('result')) {
			document.getElementById('conf-result').value = report_obj.conformanceMeta.result;
			document.getElementById('conf-result-status').textContent = smartConformance.STATUS[report_obj.conformanceMeta.result]
		}
		
		/* load credentials - multiple credentials currently disabled */
		
		//for (var i = 1; i < 25; i++) {
			if (report_obj["conformanceMeta"].hasOwnProperty("credential")) {
				//if (i > 1) {
				//	conf_meta.addCredential();
				//}
				document.getElementById('credentialName').value = report_obj['conformanceMeta']['credential']['name'];
				document.getElementById('credentialLink').value = report_obj['conformanceMeta']['credential']['link'];
			}
			//else {
			//	break;
			//}
		//}
		
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
		
		/* load extensions */
		if (Object.keys(extension).length > 0) {
			for (var key in extension) {
				extension[key].loadData(report_obj);
			}
		}
		
		alert('Report successfully loaded!');
		
		//load_dialog.dialog('close');
	}
	
	
	
	function loadDiscoveryMeta(id,obj) {
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
	
	
	
	function loadSufficientModes(modeSets) {
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
	
	
	function clear(quiet) {
		
		if (!quiet && !confirm('WARNING: All currently entered data will be deleted. This operation cannot be undone.\n\nClick Ok to continue or Cancel to exit.')) {
			return;
		}
		
		/* clear all forms */
		var forms = document.forms;
		
		for (var x = 0; x < forms.length; x++) {
			forms[x].reset();
		}
		
		/* hide epub feature warnings */
		
		var warn_elem = document.querySelectorAll('section.warning, li.manifest, li.bindings, li.epub-switch, li.epub-trigger');
		
		for (var i = 0; i < warn_elem.length; i++) {
			warn_elem[i].style.display = 'none';
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
			disc_elem[i].classList.remove(smartFormat.BG.ERR, smartFormat.BG.WARN, smartFormat.BG.PASS, smartFormat.BG.NA);
			var custom = disc_elem[i].getElementsByClassName('custom');
			for (var j = 0; j < custom.length; j++) {
				custom[j].parentNode.removeChild(custom[j]);
			}
		}
		
		/* clear artefacts from config */
		document.getElementById('title').classList.remove(smartFormat.BG.ERR);
		document.getElementById('modified').classList.remove(smartFormat.BG.ERR);
		
		/* clear extensions */
		if (Object.keys(extension).length > 0) {
			for (var key in extension) {
				extension[key].clear();
			}
		}
		
		smartError.clearAll();
		smartError.hideErrorPane();
		
		/* clear the import messages */
		
		var import_dlg = document.getElementById('import');
		
		while(import_dlg.firstChild) {
			import_dlg.removeChild(import_dlg.firstChild);
		}
	
	}
	
	
	
	function setSavedReport() {
		var data_elem = document.getElementById('savedReportOpt');
		if (!data_elem.checked) {
			data_elem.click();
		}
	}
	
	
	
	return {
	
		saveConformanceReport: function() {
			saveConformanceReport();
		},
		
		loadLocalReport: function(){
			var report_textarea = document.getElementById('local-report-json');
			var json_text = report_textarea.value;
			var json;
			
			try {
				json = JSON.parse(json_text);
			}
			
			catch (e) {
				alert('Failed to load report.\n\n' + e); 
				return;
			}
			
			if (json.hasOwnProperty('aceFlag') && json.aceFlag == 'savedReport') {
				loadConformanceReport(json);
			}
			else {
				smartAce.storeReportJSON(json);
				smartAce.loadReport();
			}
			report_textarea.value = '';
		},
		
		loadConformanceReport: function(data){
			loadConformanceReport(data);
		},
		
		saveDiscoveryMeta: function(id) {
			saveDiscoveryMeta(id);
		},
		
		loadDiscoveryMeta: function(id) {
			loadDiscoveryMeta(id);
		},
		
		clear: function(quiet) {
			clear(quiet);
		},
		
		clearSaved: function() {
			clearSaved();
		},
		
		clearSavedReport: function() {
			clearSavedReport();
		}
	}

})(smartFormat,smartError,smartAce,smartConformance);
