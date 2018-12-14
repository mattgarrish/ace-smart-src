<?php require_once 'users/init.php' ?>
<?php if (!securePage($_SERVER['PHP_SELF'])) { die(); } ?>

<?php include 'php/evaluations.php' ?>
<?php
	$eval = new SMART_EVALUATION(array(
		'username' => $user->data()->username,
		'company' => $user->data()->company,
		'shared' => $user->data()->shared,
		'license' => $user->data()->license,
		'id' => isset($_POST['id']) ? $_POST['id'] : 0
	));
	
	$eval->check_license();
?>

<!DOCTYPE html>
<html lang="en" prefix="dcterms: http://purl.org/dc/terms/ schema: http://schema.org/" typeof="schema:WebPage">
	<head>
		<meta charset="utf-8"/>
		<title>Ace SMART</title>
		<link rel="stylesheet" href="https://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />		
		<link rel="stylesheet" href="https://code.jquery.com/ui/1.12.1/themes/base/jquery-ui.css"/>
		<link rel="stylesheet" type="text/css" href="css/a11y.css"/>
		<link rel="stylesheet" type="text/css" href="css/tabs.css"/>
		<link rel="stylesheet" type="text/css" href="css/drag-drop.css"/>
    	<link rel="stylesheet" type="text/css" href="css/datatables.min.css"/>		
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
		
		<script async src="https://www.googletagmanager.com/gtag/js?id=UA-327448-4"></script>
		<script>
			window.dataLayer = window.dataLayer || [];
			function gtag(){dataLayer.push(arguments);}
			gtag('js', new Date());
			gtag('config', 'UA-327448-4');
		</script>
		
		<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
		<script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
		<script src="js/jquery.details.min.js"></script>
		
		<!-- DataTables -->
		<script type="text/javascript" src="js/datatables.min.js"></script>
		<script type="text/javascript" src="js/datatables-init.js"></script>
		<script type="text/javascript" src="js/js.cookie.js"></script>
		
		<!-- messages -->
		<script src="js/messages.js"></script>
		
		<?php
			if (isset($_POST['action'])) {
				if ($_POST['action'] == 'delete') {
					if (!$eval->delete_evaluation()) {
						echo '<script>alert(smart_errors.en.delfail);</script>';
					}
				}
				
				else if ($_POST['action'] == 'fulldelete') {
					if (!$eval->delete_record()) {
						echo '<script>alert(smart_errors.en.recfail);</script>';
					}
				}
			}
		?>
	</head>
	
	<body>
		<header>
			<div class="id">You are logged in as <code><a target="_blank" href="users/account.php"><?php echo $user->data()->username; ?></a></code> <a class="logout" href="users/logout.php">Log out</a></div>
			
			<h1><span property="dcterms:publisher"><img class="logo" src="images/daisy_logo.png" alt="DAISY Consortium"/></span> <span property="dcterms:title">Ace <span class="smart_hd">SMART</span></span></h1>
			
			<nav class="menubar">
				<a href="user-guide/" target="_blank">User Guide</a> 
				<a href="faq.html" target="_blank">FAQ</a>
				<span style="float: right; padding-right: 4.5rem"><a href="old/index.php">Restore old SMART site</a></span>
			</nav>
		</header>
		
		<main class="js-tabs">
			<h2>Welcome to Ace SMART</h2>
			
			<section id="load">
				<h3 class="welcome">Start an Evaluation</h3>
				
				<?php $eval->add_evaluation_form() ?>
			</section>
			
			<section id="history">
				<h3 class="welcome">Evaluation History</h3>
				
				<table id="evaluations" class="table table-striped table-bordered">
					<thead>
						<tr>
							<th>Title</th>
							<th>Started</th>
							<th>Last Saved</th>
							<th>Status</th>
							<th>Options</th>
						</tr>
					</thead>
					<tbody>
						<?php $eval->list_evaluations(); ?>
					</tbody>
				</table>
				<p><small>All times are in UTC.</small><p>
			</section>
		</main>
		
		<div id="import" aria-label="Resume from locally-saved file" title="Resume from locally-saved file">
			<input type="file" name="local-eval" id="local-eval"/>
		</div>
		
		<div id="error" aria-label="Error" title="Error">
			<p id="error-msg"></p>
		</div>
		
		<footer>
			<p>Copyright &#169; <span property="dcterms:dateCopyrighted">2017</span> <a target="_blank" href="http://daisy.org">DAISY Consortium</a>. All Rights Reserved.</p>
			<p><a target="_blank" href="http://www.github.com/DAISY/ace-smart/issues">Report a problem</a> | <a target="_blank" href="http://www.daisy.org/terms-use">Terms of Use</a></p>
			<p><small>Icons by <a href="https://www.iconfinder.com/flaticondesign">Icon Studio</a> used under <a href="https://creativecommons.org/licenses/by/3.0/">CC-By 3.0</small></a>
		</footer>
		
		<script src="js/drag-drop.js"></script>
		<script src="js/init-index.js"></script>
	</body>
</html>
