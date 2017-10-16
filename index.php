<?php require_once 'users/init.php' ?>
<?php require_once 'extensions/config.php' ?>
<?php if (!securePage($_SERVER['PHP_SELF'])) { die(); } ?>

<!DOCTYPE html>
<html lang="en" prefix="dcterms: http://purl.org/dc/terms/ schema: http://schema.org/" typeof="schema:WebPage">
	<head>
		<meta charset="utf-8"/>
		<title>EPUB Accessibility Conformance and Reporting</title>
		<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"/>
		<link rel="stylesheet" type="text/css" href="css/a11y.css"/>
		<?php
			if ($ace_users[$user->data()->username]) {
				echo '<link rel="stylesheet" type="text/css" href="extensions/' . $user->data()->username . '/css/custom.css"/>';
			}
		?>
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
		<?php echo "<script>var user_ext = ''; var ACE_USER = '" . $user->data()->username . "';</script>"; ?>
	</head>
	
	<body class="tabs">
		<header>
			<div class="id">You are logged in as <code><?php echo $user->data()->username; ?></code> <a href="users/logout.php">Log out</a></div>
			
			<h1><span property="dcterms:publisher"><img class="logo" src="images/daisy_logo.png" alt="DAISY Consortium"/></span> <span property="dcterms:title">EPUB Accessibility Conformance and Reporting</span></h1>
			
			<nav class="menubar">
				<a>Home</a>
				<a href="user-guide/">How to Use</a> 
				<a href="faq.html">FAQ</a>
				<a href="#" onclick="manage.saveConformanceReport(); return false" class="save-button">Save</a>
				<a href="#" onclick="manage.clear(); return false" class="clear-button">Clear</a>
			</nav>
		</header>
		
		<main class="js-tabs">
			<ul class="js-tablist" data-existing-hx="h3">
				<li class="js-tablist__item">
					<a href="#start" id="label_start" class="js-tablist__link">Start</a>
				</li>
				<li class="js-tablist__item">
					<a href="#verification" id="label_verification" class="js-tablist__link">Conformance Verification</a>
				</li>
				<li class="js-tablist__item">
					<a href="#discovery" id="label_discovery" class="js-tablist__link">Discovery Metadata</a>
				</li>
				<li class="js-tablist__item">
					<a href="#conformance" id="label_conformance" class="js-tablist__link">Conformance Metadata</a>
				</li>
				<li class="js-tablist__item">
					<a href="#generate" id="label_generate" class="js-tablist__link">Generate Report</a>
				</li>
			</ul>
	
			<?php include 'tab/start.html' ?>
			
			<form class="report">
				
				<?php include 'tab/verification.html' ?>
				
				<?php include 'tab/discovery.php' ?>
				
				<?php include 'tab/conformance.php' ?>
				
				<?php include 'tab/generate.html' ?>
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
			<p>Copyright &#169; <span property="dcterms:dateCopyrighted">2017</span> <a href="http://daisy.org">DAISY Consortium</a>. All Rights Reserved.</p>
			<p><a href="http://www.daisy.org/terms-use">Terms of Use</a> | <a href="http://www.daisy.org/contact">Contact</a></p>
		</footer>
		
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
		<script src="js/jquery.details.min.js"></script>
		<script src="https://cdn.polyfill.io/v2/polyfill.min.js"></script>
		
		<?php
			if ($ace_users[$user->data()->username]) {
				echo '<script src="extensions/' . $user->data()->username . '/js/custom.js"></script>';
			}
		?>
		<script src="js/a11ytabs.js"></script>
		<script src="js/drag-drop.js"></script>
		<script src="js/ace.js"></script>
		<script src="js/reporting.js"></script>
		<script src="js/manage.js"></script>
		
		<script src="js/init.js"></script>
</body>
</html>
