<?php require_once 'users/init.php' ?>

<?php
	if ($_POST['auto']) {
		$validate = new Validate();
		$validation = $validate->check($_POST, array(
			'username' => array('display' => 'Username','required' => true),
			'password' => array('display' => 'Password', 'required' => true)));
		if ($validation->passed()) {
			$user = new User();
			$login = $user->loginEmail(Input::get('username'), trim(Input::get('password')), false);
			if (!$login) {
				http_response_code(401);
				Redirect::to('index.php');
				exit();
			}
		}
		else {
			http_response_code(401);
			Redirect::to('index.php');
			exit();
		}
	}
	
	else {
		if (!securePage($_SERVER['PHP_SELF'])) { die(); }
	}
?>

<?php require_once 'extensions/config.php' ?>

<?php require_once 'php/evaluations.php' ?>
<?php require_once 'php/extensions.php' ?>

<?php
	if (!$_POST['action'] && !$_POST['auto']) { header("Location: index.php"); die(); }
	
	$eval = new SMART_EVALUATION(array(
		'username' => $user->data()->username,
		'company' => $user->data()->company,
		'shared' => $user->data()->shared,
		'license' => $user->data()->license,
		'title' => $_POST['title'],
		'action' => $_POST['action'] ? $_POST['action'] : ($_POST['auto'] ? 'autoload' : ''),
		'id' => $_POST['id'],
		'pubid' => $_POST['pubid']
	));
	
	$eval->check_license();
	
	$ext = new SMART_EXTENSIONS($user->data()->modules, $extension);
?>

<!DOCTYPE html>
<html lang="en" prefix="dcterms: http://purl.org/dc/terms/ schema: http://schema.org/" typeof="schema:WebPage">
	<head>
		<meta charset="utf-8"/>
		<title>EPUB Evaluation - Ace SMART</title>
		<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"/>
		<link rel="stylesheet" type="text/css" href="css/a11y.css"/>
		<link rel="stylesheet" type="text/css" href="css/tabs.css"/>
		
		<?php $ext->print_css(); ?>
		
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
		
		<!-- DC metadata --> 
		<meta property="dcterms:created" content="2017-03-02"/>
		<meta property="dcterms:description" content="The Ace SMART tool aids in the evaluation of EPUB publications for conformance to the EPUB Accessibility specification."/>
		<meta property="dcterms:language" content="en"/>
		
		<!-- schema.org a11y metadata -->
		<meta property="schema:accessibilityFeature" content="structuralNavigation"/>
		<meta property="schema:accessibilityFeature" content="displayTransformability"/>
		<meta property="schema:accessMode" content="textual"/>
		<meta property="schema:accessModeSufficient" content="textual"/>
		<meta property="schema:accessibilityHazard" content="none"/>
		
		<script async="async" src="https://www.googletagmanager.com/gtag/js?id=UA-327448-4"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', 'UA-327448-4');
		</script>
		
		<script id="report_data" type="application/json">
			<?= $eval->load_evaluation() ?>
		</script>
		
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
		<script src="js/jquery.details.min.js"></script>
		<script>(function(e,t,n){var r=e.querySelectorAll("html")[0];r.className=r.className.replace(/(^|\s)no-js(\s|$)/,"$1js$2")})(document,window,0);</script>
		<?php echo <<<JS
		<script>
			var smart_lang = 'en';
			var smart_locale = 'en-us';
			var smart_extensions = {};
			var ACE_USER = '{$user->data()->username}';
			var ACE_SHARED = '{$user->data()->shared}';
			var ACE_USER_CO = '{$user->data()->company}';
			var ACE_ACTION = '{$eval->get_action()}';
			var ACE_ID = '{$eval->get_eval_id()}';
			var saveChanges = false;
			var firstSave = {$eval->need_to_save()};
		</script>
JS;
?>
		<script src="js/config/messages.js"></script>
		<script src="js/ace.js"></script>
		<script src="js/manage.js"></script>
		<script src="js/error.js"></script>
		<script src="js/format.js"></script>
		<script src="js/wcag.js"></script>
		<script src="js/reporting.js"></script>
	</head>
	
	<body class="tabs">
		<header>
			<div class="id">You are logged in as <code><a target="_blank" href="users/account.php"><?php echo $user->data()->username; ?></a></code> <a class="logout" href="users/logout.php">Log out</a></div>
			
			<h1><span property="dcterms:publisher"><img class="logo" src="images/daisy_logo.png" alt="DAISY Consortium"/></span> <span property="dcterms:title">Ace <span class="smart_hd">SMART</span></span></h1>
			
			<nav class="menubar">
				<a href="user-guide/" target="_blank">User Guide</a> 
				<a href="faq.html" target="_blank">FAQ</a>
				<a href="#" id="close-button">Close</a>
				<a href="#" id="save-button">Save</a>
				<a href="#" id="validate-button">Validate</a>
			</nav>
		</header>
		
		<main class="js-tabs">
			<ul class="js-tablist" data-existing-hx="h3">
				<li class="js-tablist__item">
					<a href="#start" id="label_start" class="js-tablist__link">Pub Info</a>
				</li>
				<li class="js-tablist__item">
					<a href="#conformance" id="label_conformance" class="js-tablist__link">Conformance</a>
				</li>
				<?php $ace_extension_tabs = $ext->print_tabs(); ?>
				<li class="js-tablist__item">
					<a href="#discovery" id="label_discovery" class="js-tablist__link">Discovery</a>
				</li>
				<li class="js-tablist__item">
					<a href="#distribution" id="label_distribution" class="js-tablist__link">Distribution</a>
				</li>
				<li class="js-tablist__item">
					<a href="#evaluation" id="label_evaluation" class="js-tablist__link">Result</a>
				</li>
				<li class="js-tablist__item">
					<a href="#generate" id="label_generate" class="js-tablist__link">Reporting</a>
				</li>
			</ul>
	
			<section id="start" class="js-tabcontent">
				<h2>Publication Information</h2>
				
				<form class="report">
					<p class="instr">Ensure the following publication information is complete and accurate. Required fields for final report are denoted by an asterisk.</p>
						
					<div class="data form-data">
						<fieldset class="flat">
							<legend>Format:</legend>
							<!-- <div><small>Note: This setting also controls the format of the discovery and conformance metadata.</small></div> -->
							<label><input type="radio" name="epub-format" value="3" checked="checked"/> EPUB 3</label>
							<label><input type="radio" name="epub-format" value="2"/> EPUB 2</label>
						</fieldset>
						
						<label class="data"><span>Title:<img src="images/asterisk.png" alt="required"/></span> <input type="text" id="title" aria-required="true"/></label>
						<label class="data"><span>Author(s):</span> <input type="text" id="creator"/></label>
						<label class="data"><span>Identifier:</span> <input type="text" id="identifier"/></label>
						<label class="data"><span>Publisher:</span> <input type="text" id="publisher"/></label>
						<label class="data"><span>Date Published:</span> <input type="text" id="date"/></label>
						<div class="combo">
							<label><span>Last Modified:<img src="images/asterisk.png" alt="required"/></span> <input type="text" id="modified"/></label>
							<label><input type="button" id="add-timestamp" value="Set to now"/></label>
						</div>
						<label class="data"><span>Subject:</span> <input type="text" id="subject"/></label>
						<label class="data"><span>Description:</span> <input type="text" id="description"/></label>
						<label class="data"><span>Additional Metadata:</span> <textarea rows="8" aria-describedby="meta-input-desc" id="optional-meta" placeholder="label: value"></textarea></label>
						<div id="meta-input-desc" hidden="hidden">Use a colon followed by a space to separate the label from the value. Separate metadata items with a return character.</div>
					</div>
				</form>
			</section>
			
			<form class="report">
			
				<section id="conformance" class="js-tabcontent">
					<h2>Conformance Verification</h2>
					
					<p>This section contains the list of success criteria the publication must meet to conform to the EPUB Accessibility specification.</p>
					
					<p>Use the following fields to configure the testing criteria:</p>
					
					<div class="form-data">
						<fieldset class="flat">
							<legend>WCAG Conformance:</legend>
							<label><input type="radio" name="wcag-level" value="a"/> Level A</label>
							<label><input type="radio" name="wcag-level" value="aa" checked="checked"/> Level AA</label>
						</fieldset>
						
						<fieldset id="exclusions" class="flat">
							<legend>Exclude Tests For:</legend>
							<label><input type="checkbox" value="img" class="excl-test"/> Images</label>
							<label><input type="checkbox" value="audio" class="excl-test"/> Audio</label>
							<label><input type="checkbox" value="video" class="excl-test"/> Video</label>
							<label><input type="checkbox" value="script" class="excl-test"/> Scripting</label>
						</fieldset>
					</div>
					
					<details id="view-options">
						<summary>Additional Options</summary>
						
						<fieldset class="flat">
							<legend>Show Optional Criteria:</legend>
							<label><input type="checkbox" id="show-aa" class="optional-criteria" disabled="disabled"/> Level AA</label>
							<label><input type="checkbox" id="show-aaa" class="optional-criteria"/> Level AAA</label>
						</fieldset>
						
						<fieldset class="flat">
							<legend>Hide success criteria with status:</legend>
							<label><input type="checkbox" class="hide_sc" value="unverified"/> Unverified</label>
							<label><input type="checkbox" class="hide_sc" value="pass"/> Pass</label>
							<label><input type="checkbox" class="hide_sc" value="fail"/> Fail</label>
							<label><input type="checkbox" class="hide_sc" value="na"/> N/A</label>
						</fieldset>
						
						<fieldset class="flat">
							<legend>Set all success criteria to:</legend>
							<label><input type="radio" name="status" value="unverified" checked="checked"/> Unverified</label>
							<label><input type="radio" name="status" value="pass"/> Pass</label>
							<label><input type="radio" name="status" value="fail"/> Fail</label>
							<label><input type="radio" name="status" value="na"/> N/A</label>
						</fieldset>
						
						<fieldset class="flat">
							<legend>Success criteria descriptions:</legend>
							<label><input type="radio" name="sc-body" value="true" checked="checked"/> Expand all</label>
							<label><input type="radio" name="sc-body" value="false"/> Collapse all</label>
						</fieldset>
						
						<fieldset class="flat">
							<legend>Help links:</legend>
							<label><input type="radio" name="link-exp" value="false" checked="checked"/> Collapse all</label>
							<label><input type="radio" name="link-exp" value="true"/> Expand all</label>
						</fieldset>
					</details>
					
					<p>Set the status of each success criterion to Pass, Fail or Not Applicable (N/A) as you go. Note fields are provided after the status to include additional information in the final report.</p>
					
					<section id="fallbacks" class="warning">
						<h3>Warning</h3>
						
						<p>The following EPUB-specific features were detected in the publication:</p>
						
						<ul id="fallback-types">
							<li class="manifest">The use of the <code>fallback</code> attribute in the package document (manifest fallbacks)</li>
							<li class="bindings">The use of the <code>bindings</code> element for media type-specific fallbacks in the package document</li>
							<li class="epub-switch">The use of the <code>epub:switch</code> element to provide fallbacks in content documents</li>
							<li class="epub-trigger">The use of the <code>epub:trigger</code> element for audio/video control</li>
						</ul>
						
						<p>These features are not broadly supported and do not meet the WCAG requirements for an accessible technology. You must verify
							that the accessibility of the publication is not dependent on support for these. If so, fail the pubication on any success
							criteria that are breached.</p>
						
						<p>Examples of how these features are used in inaccessible ways include:</p>
						
						<ul>
							<li class="manifest">Including images in the spine and using manifest fallbacks to provide an XHTML alternative (fails SC 1.1.1)</li>
							<li class="manifest">Including an inaccessible scripted XHTML document in the spine and using a manifest fallback to provide an accessible version (fails SC 2.1.1, 4.1.2 and potentialy others depending on what makes the default document inaccessible)</li>
							<li class="bindings">Adding an unsupported file type and using bindings to provide an accessible fallback (fails SC 1.1.1)</li>
							<li class="epub-switch">Replacing images with MathML markup using the <code>epub:switch</code> element (fails SC 1.1.1 if the image doesn't provide alt text or a description for the math in the image)</li>
							<li class="epub-trigger">Disabling the native controls on the audio and video elements by default to use triggers (fails SC 2.1.1. for lack of keyboard access)</li>
						</ul>
					</section>
					<!-- SC dynamically inserted -->
				</section>
				
				<?php $ext->add_tab_includes() ?>
				
				<section id="discovery" class="js-tabcontent">
					<h2>Discovery Metadata</h2>
					
					<p>This section allows you to visualize and correct the discovery metadata in the publication. Click on each
						field's heading for more information about how to apply the metadata.</p>
					
					<p>Use the Generate button at the bottom of the page to create a set of metadata tags that can be pasted back into 
						the publication.</p>
					
					<div id="discovery-fields"></div>
					
					<div class="buttons">
						<input type="button" class="button_hlt" id="discovery_button" value="Generate"/>
					</div>
					
					<section id="discovery-meta" aria-label="Discovery Metadata" title="Discovery Metadata">
						<p>Copy and paste the following metadata to the EPUB package document.</p>
						<textarea id="discovery-metadata" rows="15" aria-label="discovery metadata"></textarea>
					</section>
				</section>

				<section id="distribution" class="js-tabcontent">
					<h2>Distribution Metadata</h2>
					
					<p>This section allows you to generate accessibility metadata for use in an ONIX record.</p>
					
					<p>Use the Generate button at the bottom of the page to create a set of metadata tags.</p>
					
					<div id="distribution-fields"></div>
					
					<div class="buttons">
						<input type="button" class="button_hlt" id="distribution_button" value="Generate"/>
					</div>
					
					<section id="distribution-meta" aria-label="ONIX Metadata" title="ONIX Metadata">
						<p>Copy and paste the following metadata to the ONIX record.</p>
						<textarea id="distribution-metadata" rows="15" aria-label="distribution metadata"></textarea>
					</section>
				</section>
				
				<section id="evaluation" class="js-tabcontent">
					<h2>Evaluation Result</h2>
					
					<p>This section is for reporting conformance and identifying the evaluator of this report.</p>
					
					<p>Use the Generate button at the bottom of the page to create a set metadata tags that can be pasted back into the publication.</p>
					
					<div class="conformance-result">
						<strong>Conformance Result:</strong>
						<span id="conformance-result-status">Incomplete</span>
						<input type="hidden" name="conformance-result" id="conformance-result" value="incomplete"/>
					</div>
					
					<div id="extension-results"></div>
					
					<fieldset>
						<legend>Evaluation Info:</legend>
						<label class="data"><span>Evaluator:<img src="/images/asterisk.png" alt="required"/></span> <input type="text" id="certifiedBy" aria-required="true"/></label>
						<label class="data"><span>Link to report:</span> <input type="text" id="certifierReport"/></label>
					</fieldset>
					
					<div class="buttons">
						<input type="button" class="button_hlt" value="Generate" id="generate-evaluation-metadata"/>
					</div>
					
					<section id="evaluation-meta" aria-label="Evaluation Metadata" title="Evaluation Metadata">
						<p>Copy and paste the following metadata to the EPUB package document.</p>
						<textarea id="evaluation-metadata" rows="6" aria-label="evaluation metadata"></textarea>
					</section>
				</section>
				
				<section id="generate" class="js-tabcontent">
					<h2>Generate Report</h2>
					
					<fieldset>
						<legend>Notes</legend>
						<div class="instr">Select what notes to include in the report.</div>
						<label><input type="radio" name="show-notes" value="all" checked="checked"/> All</label>
						<label><input type="radio" name="show-notes" value="failures"/> Only failure descriptions</label>
						<label><input type="radio" name="show-notes" value="notes"/> Only notes</label>
						<label><input type="radio" name="show-notes" value="none"/> None</label>
					</fieldset>
					
					<p id="gen">If there are errors validating the report, you will receive a warning before it is generated. Errors will be listed in a message panel at the bottom of the page. Clicking on an error will take you to the location.</p>
					
					<p><input type="button" value="Preview" id="preview-report" class="button_hlt preview" aria-describedby="popup-instructions"/></p>
					<p><input type="button" class="button_hlt" value="Create" id="generate-report" aria-describedby="gen"/></p>
					
					<div id="popup-instructions">
						<p>Ensure that you do not have a pop-up blocker enabled when previewing content.</p>
						<p>Do not bookmark the preview page, as the report is lost once your browser is closed.</p>
					</div>
					
				</section>
			</form>
		</main>
		
		<div id="save" aria-label="Save report" title="Save report">
			<p>Please select where you would like to save the report:<p>
			<fieldset>
				<div><label><input type="radio" name="location" value="remote" checked="checked"/> Ace SMART server</div>
				<div><label><input type="radio" name="location" value="local"/> Local file system</div>
			</fieldset>
		</div>
		
		<div id="import" aria-label="Ace Import Details" title="Ace Import Details">
		
		</div>
		
		<form class="report">
			<section id="error-pane" role="region" aria-labelledby="validation-msg">
				<a href="#error-pane-close" id="error-pane-close"><img src="images/close-icon.png" alt="Close" class="error-close"/></a>
				<h2 id="validation-msg">Validation Messages:</h2>
				<div role="log" aria-labelledby="validation-msg" class="scroll">
					<ul id="error-msg"></ul>
				</div>
			</section>
		</form>
		
		<footer>
			<p>Copyright &#169; <span property="dcterms:dateCopyrighted">2017</span> <a target="_blank" href="http://daisy.org">DAISY Consortium</a>. All Rights Reserved.</p>
			<p><a target="_blank" href="http://www.github.com/DAISY/ace-smart/issues">Report a problem</a> | <a target="_blank" href="http://www.daisy.org/terms-use">Terms of Use</a></p>
		</footer>
		
		<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
		<script src="js/a11ytabs.js"></script>
		<script src="js/config/sc.js"></script>
		<script src="js/conformance.js"></script>
		<script src="js/config/discovery.js"></script>
		<script src="js/discovery.js"></script>
		<script src="js/config/distribution.js"></script>
		<script src="js/distribution.js"></script>
		<script src="js/evaluation.js"></script>
		
		<?php $ext->print_scripts(); ?>
		
		<script src="js/init-smart.js"></script>
</body>
</html>
