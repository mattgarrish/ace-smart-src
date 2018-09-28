<?php require_once 'users/init.php' ?>
<?php if (!securePage($_SERVER['PHP_SELF'])) { die(); } ?>

<?php require_once 'extensions/config.php' ?>

<?php require_once 'php/evaluations.php' ?>
<?php require_once 'php/extensions.php' ?>

<?php
	if (!$_POST['action']) { header("Location: index.php"); die(); }
	
	$eval = new SMART_EVALUATION(array(
		'username' => $user->data()->username,
		'company' => $user->data()->company,
		'action' => $_POST['action'],
		'id' => $_POST['id']
	));
	
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
		<meta property="schema:accessibilityAPI" content="ARIA"/>
		<meta property="schema:accessibilityControl" content="fullMouseControl"/>
		<meta property="schema:accessibilityControl" content="fullKeyboardControl"/>
		<meta property="schema:accessibilityControl" content="fullTouchControl"/>
		
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
		<?php echo "<script>var smart_extensions = {}; var ACE_USER = '" . $user->data()->username . "'; var ACE_USER_CO = '" . $user->data()->company . "'; var ACE_ACTION = '" . $_POST['action'] . "'; var ACE_ID = '" . $_POST['id'] . "'; var saveChanges = false;</script>"; ?>
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
				<a href="#" id="save-button">Save</a>
				<a href="#" id="close-button">Close</a>
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
	
			<?php include 'tab/start.html' ?>
			
			<form class="report">
				
				<?php include 'tab/conformance.html' ?>
				
				<?php $ext->add_tab_includes() ?>
				
				<?php include 'tab/discovery.html' ?>
				
				<?php include 'tab/distribution.html' ?>
				
				<?php include 'tab/evaluation.html' ?>
				
				<?php include 'tab/generate.html' ?>
			</form>
		</main>
		
		<div id="save" aria-label="Save report" title="Save report">
			<p>Please select where you would like to save the report:<p>
			<fieldset>
				<div><input type="radio" name="location" value="remote" checked="checked"/> Ace SMART server</div>
				<div><input type="radio" name="location" value="local"/> Local file system</div>
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
		<script src="js/discovery.js"></script>
		<script src="js/evaluation.js"></script>
		<script src="js/conformance.js"></script>
		
		<?php $ext->print_scripts(); ?>
		
		<script src="js/init-smart.js"></script>
</body>
</html>
