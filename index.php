<?php require "login/loginheader.php"; ?>
<!DOCTYPE html>
<html lang="en" prefix="dcterms: http://purl.org/dc/terms/ schema: http://schema.org/" typeof="schema:WebPage">
	<head>
		<meta charset="utf-8"/>
		<title>EPUB Accessibility Conformance and Reporting</title>
		<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"/>
		<link rel="stylesheet" type="text/css" href="css/a11y.css"/>
		<link rel="stylesheet" type="text/css" href="css/drag-drop.css"/>
		
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		
		<!-- DC metadata --> 
		<meta property="dcterms:created" content="2017-03-02"/>
		<meta property="dcterms:description" content="The EPUB Accessibility Conformance and Reporting tool aids in the evaluation of EPUB publication for conformance to the EPUB Accessibility specification."/>
		<meta property="dcterms:language" content="en"/>
		
		<!-- schema.org a11y metadata --> 
		<meta property="schema:accessibilityFeature" content="structuralNavigation"/>
		<meta property="schema:accessMode" content="textual"/>
		<meta property="schema:accessModeSufficient" content="textual"/>
		<meta property="schema:accessibilityHazard" content="none"/>
		<meta property="schema:accessibilityAPI" content="ARIA"/>
		<meta property="schema:accessibilityControl" content="fullMouseControl"/>
		<meta property="schema:accessibilityControl" content="fullKeyboardControl"/>
		<meta property="schema:accessibilityControl" content="fullTouchControl"/>
		
		<script>(function(e,t,n){var r=e.querySelectorAll("html")[0];r.className=r.className.replace(/(^|\s)no-js(\s|$)/,"$1js$2")})(document,window,0);</script>
	</head>
	
	<body class="tabs">
		<header>
			<h1><span property="dcterms:publisher"><img class="logo" src="images/daisy_logo.png" alt="DAISY Consortium"/></span> <span property="dcterms:title">EPUB Accessibility Conformance and Reporting</span></h1>
			
			<nav class="menubar">
				<a>Home</a>
				<a href="user-guide/">How to Use</a> 
				<a href="faq.html">FAQ</a>
			</nav>
			
			<div id="report-buttons">
				<input type="button" value="Configure" onclick="config_dialog.dialog('open')"/>
				<input type="button" value="Save" onclick="manage.openSave()"/>
				<input type="button" value="Restore" onclick="manage.openLoad()"/>
			</div>
		</header>
		
		<main class="js-tabs">
			<ul class="js-tablist" data-existing-hx="h3">
				<li class="js-tablist__item">
					<a href="#start" id="label_start" class="js-tablist__link">1. Start</a>
				</li>
				<li class="js-tablist__item">
					<a href="#verification" id="label_verification" class="js-tablist__link">2. Conformance Verification</a>
				</li>
				<li class="js-tablist__item">
					<a href="#discovery" id="label_discovery" class="js-tablist__link">3. Discovery Metadata</a>
				</li>
				<li class="js-tablist__item">
					<a href="#conformance" id="label_conformance" class="js-tablist__link">4. Conformance Metadata</a>
				</li>
				<li class="js-tablist__item">
					<a href="#generate" id="label_generate" class="js-tablist__link">5. Generate Report</a>
				</li>
			</ul>
			
			<?php include 'tab/start.html' ?>
			
			<form class="report">
				
				<?php include 'tab/verification.html' ?>
				
				<?php include 'tab/discovery.php' ?>
				
				<?php include 'tab/conformance.php' ?>
				
				<?php include 'tab/generate.html' ?>
								
				<section id="config" aria-label="Report Configuration" title="Report Configuration">
					
					<p><small>Note: All changes take effect immediately.</small></p>
					
					<!--
					<div class="data">
						<span style="vertical-align: top;">Automated Testing Report:</span>
						<textarea id="auto-rep" rows="3" aria-label="automatic testing report" style="vertical-align:bottom;"></textarea>
						<input type="button" value="Update"/>
					</div>
					-->
					
					<fieldset class="data">
						<legend>WCAG Conformance:</legend>
						<label class="show-xtra"><input type="checkbox" id="show-aa" onchange="conf.showLevel('aa', (this.checked ? true : false))" disabled="disabled"/> Show Level AA Criteria</label>
						<label class="show-xtra"><input type="checkbox" id="show-aaa" onchange="conf.showLevel('aaa', (this.checked ? true : false))"/> Show Level AAA Criteria</label>
					</fieldset>
					
					<fieldset id="exclusions">
						<legend>Include requirements for:</legend>
						<label><input type="checkbox" id="img" value="img" onchange="conf.changeContentConformance(this,'img')" checked="checked"/> Images</label>
						<label><input type="checkbox" id="audio" value="audio" onchange="conf.changeContentConformance(this,'audio')" checked="checked"/> Audio</label>
						<label><input type="checkbox" id="video" value="video" onchange="conf.changeContentConformance(this,'video')" checked="checked"/> Video</label>
						<label><input type="checkbox" id="script" value="script" onchange="conf.changeContentConformance(this,'script')" checked="checked"/> Scripting</label>
						<label><input type="checkbox" id="forms" value="forms" onchange="conf.changeContentConformance(this,'forms')" checked="checked"/> Form Elements</label>
					</fieldset>
					
					<div class="reporting">
						<fieldset id="set-all">
							<legend>Set all status to:</legend>
							<label><input type="radio" name="status" onchange="conf.setStatusAdmin('unverified')" checked="checked"/> Unverified</label>
							<label><input type="radio" name="status" onchange="conf.setStatusAdmin('pass')"/> Pass</label>
							<label><input type="radio" name="status" onchange="conf.setStatusAdmin('fail')"/> Fail</label>
							<label><input type="radio" name="status" onchange="conf.setStatusAdmin('na')"/> N/A</label>
						</fieldset>
					</div>
					<!-- User customization of appearance not in scope
					<div class="reporting">
						<fieldset id="styling">
							<legend>Report styling:</legend>
							<label class="block"><input type="checkbox" id="default-styles" checked="checked"/> Include default CSS</label>
							<label class="block"><input type="checkbox" id="add-custom-css"/> Add custom style sheet link</label>
							<label class="block pad-left">Enter URL to style sheet: <input type="text" id="custom-css-url"/></label>
						</fieldset>
					</div>
					-->
					<!-- disabled as actual usefulness is suspect
					<fieldset id="fields">
						<legend>Reporting:</legend>
						<label><input type="radio" name="reporting" onchange="conf.showReporting(true)" checked="checked"/> Show</label>
						<label><input type="radio" name="reporting" onchange="conf.showReporting(false)"/> Hide</label>
					</fieldset>
					-->
				</section>
				
				<section id="save-report" aria-label="Save Report" title="Save Report">
					<p id="local-na" hidden="hidden">Note: Your browser does not support local storage.</p>
					<fieldset>
						<legend>Save</legend>
						<label><input type="radio" name="save" aria-describedby="save-desc" value="storage" checked="checked"/> to local storage <span id="local-save-na"></span></label>
						<label><input type="radio" name="save" value="saved"/> to file</label>
						<p><input type="button" value="Save" onclick="manage.saveConformanceReport()"/></p>
						<div>
							<input type="button" value="Clear" aria-describedby="clear-desc" onclick="manage.clearSaved()"/> &#8212; 
							<span id="clear-desc">Remove saved reports from local storage.</span>
						</div>
					</fieldset>
				</section>
				
				<section id="load-report" aria-label="Restore Saved Report" title="Restore Saved Report">
					<fieldset>
						<legend>Load</legend>
						<label><input type="radio" name="load" value="storage" checked="checked"/> from local storage <span id="local-load-na"></span></label>
						<label><input type="radio" name="load" id="savedReportOpt" value="saved"/> saved report: <textarea id="savedReport" rows="3" cols="40" onkeydown="manage.setSavedReport();"></textarea></label>
						<p><input type="button" value="Load" onclick="manage.loadConformanceReport()"/></p>
					</fieldset>
				</section>
			</form>
		</main>
		
		<form class="report">
		<section id="error-pane">
			<a href="#error-pane" onclick="error.hide()"><img src="images/close-icon.png" alt="Close" class="error-close"/></a>
			<h2 id="validation-msg">Validation Messages:</h2>
			<div role="log" aria-labelledby="validation-msg" class="scroll">
				<ul id="error-msg"></ul>
			</div>
		</section>
		</form>
		
		<footer>
			<p>Copyright <span property="dcterms:dateCopyrighted">2017</span> <a href="http://daisy.org">DAISY Consortium</a></p>
			<p><a href="http://www.daisy.org/terms-use">Terms of Use</a> | <a href="http://www.daisy.org/contact">Contact</a></p>
		</footer>
		
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
		<script src="js/jquery.details.min.js"></script>
		<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
		
		<script src="js/a11ytabs.js"></script>
		<script src="js/drag-drop.js"></script>
		<script src="js/ace.js"></script>
		<script src="js/reporting.js"></script>
		<script src="js/manage.js"></script>
		
		<script src="js/init.js"></script>
</body>
</html>
