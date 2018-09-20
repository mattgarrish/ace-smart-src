<?php require_once 'users/init.php' ?>
<?php require_once 'extensions/config.php' ?>
<?php require_once 'modules/db.php' ?>
<?php if (!securePage($_SERVER['PHP_SELF'])) { die(); } ?>
<?php
	
	$db = new SMART_DB();
	$db->connect();
	
	if (isset($_POST['action']) && $_POST['action'] == 'delete') {
		if ($db->prepare("UPDATE reports SET status = ?, report = ?, modified = ? WHERE username = ? AND id = ?")) {
			$del_date = '0000-00-00 00:00:00';
			$del_data = '';
			$del_status = 'deleted';
			$db->bind_param("ssssi", array($del_status, $del_data, $del_date, $user->data()->username, $_POST['id']));
		    $db->execute();
		    $db->close();
		}
	}
	
	$report_max = 0;

    if ($user->data()->license != 'unlimited') {
    	$report_max = str_replace('max','',$user->data()->license);
    }
	
	if (!$user->data()->license) {
		// boot the user out
		die();
	}
	
	$is_licensed = false;
	$reports_remaining = 0;
	
	if ($user->data()->license == 'unlimited') {
		$is_licensed = true;
	}
	
	else {
		$this_month = date('Y-m-01') . ' 00:00:00';
		
		$sql = 'SELECT COUNT(title) AS report_count FROM reports ';
		
		$arg = '';
		
		if ($user->data()->company) {
			$arg = $user->data()->company;
			$sql .= 'WHERE company = ?';
		}
		
		else {
			$arg = $user->data()->username;
			$sql .= 'WHERE username = ?';
		}
		
		$sql .= ' AND created >= ?';
		
		if ($db->prepare($sql)) {
			
			$db->bind_param('ss', array($arg, $this_month));
		    
		    $db->execute();
			
			$result = $db->get_result();
			
		    $reports_remaining = $report_max - $result['report_count'];
		    
		    $db->close();
		}
		
		if ($report_max > 0) {
			$is_licensed = true;
		}
	}
?>

<!DOCTYPE html>
<html lang="en" prefix="dcterms: http://purl.org/dc/terms/ schema: http://schema.org/" typeof="schema:WebPage">
	<head>
		<meta charset="utf-8"/>
		<title>Ace SMART</title>
		<link rel="stylesheet" href="http://code.jquery.com/ui/1.10.3/themes/smoothness/jquery-ui.css" />		
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
	</head>
	
	<body>
		<header>
			<div class="id">You are logged in as <code><a target="_blank" href="users/account.php"><?php echo $user->data()->username; ?></a></code> <a class="logout" href="users/logout.php">Log out</a></div>
			
			<h1><span property="dcterms:publisher"><img class="logo" src="images/daisy_logo.png" alt="DAISY Consortium"/></span> <span property="dcterms:title">Ace <span class="smart_hd">SMART</span></span></h1>
			
			<nav class="menubar">
				<a href="user-guide/" target="_blank">User Guide</a> 
				<a href="faq.html" target="_blank">FAQ</a>
			</nav>
		</header>
		
		<main class="js-tabs">
			<h2>Welcome to Ace SMART</h2>
			
			<section id="load">
				<h3 class="welcome">Start an Evaluation</h3>
				
				<?php if ($is_licensed && ($user->data()->license == 'unlimited' || $reports_remaining > 0)) {
				
						if ($user->data()->license != 'unlimited') {
							echo '<p class="license">Note: Your license allows ' . $reports_remaining . ' more evaluations this month.</p>';
						}
				?>
				
				<div class="container js">
					<form method="post" action="smart.php" enctype="multipart/form-data" novalidate="novalidate" class="box" id="nextStep">
						<div class="box__input">
							<input type="file" name="ace-report" id="file" class="box__file"/>
							<label class="dnd" for="file"><strong>Select an Ace report</strong><span class="box__dragndrop"> or drag one here</span>.</label>
							<button type="submit" class="box__button">Load</button>
						</div>
						
						<div class="box__uploading">Uploading&#8230;</div>
						<div class="box__success">Done! <a href="" class="box__restart" role="button">Load a different report?</a></div>
						<div class="box__error">Error! <span></span>. <a href="" class="box__restart" role="button">Try again!</a></div>
						<input type="hidden" name="id" id="id" value=""/>
						<input type="hidden" name="action" id="action" value="load"/>
					</form>
				</div>
				<?php } 
				
					else {
						echo '<p class="overlimit">You have reached your report limit for this month.</p>';
					}
				?>
			</section>
			
			<section id="history">
				<h3 class="welcome">Evaluation History</h3>
				
				<table id="reports" class="table table-striped table-bordered">
					<thead>
						<tr>
							<th>Title</th>
							<th>Started</th>
							<th>Last Saved</th>
							<th>Options</th>
						</tr>
					</thead>
					<tbody>
						<?php
							if ($db->prepare("SELECT id, title, created, modified, status FROM reports WHERE username = ? ORDER BY created DESC")) {
							
								if ($db->bind_param("s", array($user->data()->username))) {
								
							    	if ($db->execute()) {
							    	
										$result = $db->get_results();
										
										foreach ($result as $row) {
											echo '<tr>';
											echo '<td>' . $row['title'] . '</td>';
											echo '<td>' . $row['created'] . '</td>';
											
											echo '<td>';
											
											if ($row['modified'] != '0000-00-00 00:00:00') {
												echo $row['modified'];
											}
											else {
												switch ($row['status']) { 
													case 'unsaved':
														echo 'Not saved';
														break;
													case 'local':
														echo 'Saved locally';
														break;
													case 'deleted':
														echo 'Deleted';
														break;
												}
											}
											
											echo '</td><td>';
											
											switch ($row['status']) {
												case 'local':
												case 'deleted':
													echo '<input type="image" src="images/resume.svg" height="40" id="reload_' . $row['id'] . '" alt="Resume" title="Resume"/>';
													break;
												
												default:
													echo '<input type="image" src="images/resume.svg" height="40" id="resume_' . $row['id'] . '" alt="Resume" title="Resume"/>';
													echo '<input type="image" src="images/delete.svg" height="40" id="delete_' . $row['id'] . '" alt="Delete" title="Delete"/>';
											
											}
											
											echo '</td>';
											echo '</tr>';
										}
										
									    $db->close();
							    	}
								}
							}
						?>
					
					</tbody>
				</table>
			</section>
		</main>
		
		<section id="import" aria-label="Resume from local report" title="Resume from local report">
			<input type="file" name="local-report" id="local-report"/>
		</section>
		
		<footer>
			<p>Copyright &#169; <span property="dcterms:dateCopyrighted">2017</span> <a target="_blank" href="http://daisy.org">DAISY Consortium</a>. All Rights Reserved.</p>
			<p><a target="_blank" href="http://www.github.com/DAISY/ace-smart/issues">Report a problem</a> | <a target="_blank" href="http://www.daisy.org/terms-use">Terms of Use</a></p>
			<p><small>Icons by <a href="https://www.iconfinder.com/flaticondesign">Icon Studio</a> used under <a href="https://creativecommons.org/licenses/by/3.0/">CC-By 3.0</small></a>
		</footer>
		
		<script src="js/drag-drop.js"></script>
		<script src="js/init-index.js"></script>
	</body>
</html>
