<?php require_once 'users/init.php' ?>
<?php if (!securePage($_SERVER['PHP_SELF'])) { die(); } ?>

<?php require_once 'php/db.php' ?>
<?php

	if (!isset($_GET['uid'])) {
		header("Location: index.php?err=noconfirm");
		die();
	}
	
	$db = new SMART_DB();
	
	if (!$db->connect()) {
		header("Location: index.php?err=confconn");
		die();
	}
	
	if (!$db->prepare("SELECT title, created FROM evaluations WHERE username = ? AND uid = ? AND id != ? ORDER BY created DESC")) {
		header("Location: index.php?err=confprep");
		die();
	}

	if (!$db->bind_param("ssi", array($user->data()->username, $_GET['uid'], $_GET['id']))) {
		header("Location: index.php?err=confbind");
		die();
	}
	
    if (!$db->execute()) {
		header("Location: index.php?err=confexec");
		die();
    }
    
    $result = $db->get_results();
    
    $db->close();
	
?>
<!DOCTYPE html>
<html lang="en">
	<head>
		<meta charset="utf-8"/>
		<title>Confirm New Evaluation - Ace SMART</title>
		<link rel="stylesheet" type="text/css" href="css/a11y.css"/>
		<link rel="stylesheet" type="text/css" href="css/tabs.css"/>
		<style type="text/css">
			h1 {
				background-color: rgb(180,0,0) !important;
				font-size: 2.3rem !important;
				text-indent: 2rem !important;
			}
			main.js-tabs {
				margin-top: 7rem !important;
			}
		</style>
		<script>
			function processAction() {
				var nextStep = document.getElementById('nextStep');
				
				if (document.getElementById('delete').checked) {
					nextStep.action = 'index.php';
					document.getElementById('action').value = 'fulldelete';
				}
				
				nextStep.submit();
			}
		</script>
	</head>
	<body>
		<header>
			<h1>Warning!</h1>
		</header>
		
		<main class="js-tabs">
			<section id="confirm">
				<p>The EPUB publication identified in the Ace report has the same unique identifier as the following evaluation(s) in your
					saved history (date created in parentheses):</p>
				
				<ul>
				<?php
					foreach ($result as $row) {
						echo '<li>' . $row['title'] . ' (' . $row['created'] . ')</li>';
					}
				?>
				</ul>
				
				<p>If you have accidentally loaded the wrong publication, please select the option to delete below. Otherwise, a new
					evaluation will be initiated.</p>
				
				<form id="nextStep" method="post" action="smart.php" onsubmit="processAction()">
					<fieldset>
						<div><label><input type="radio" id="confirm" name="option" value="confirm" checked> Continue to evaluation</label></div>
						<div><label><input type="radio" id="delete" name="option" value="delete"> Delete evaluation and return to home page</label></div>
					</fieldset>
					<input type="hidden" name="id" value="<?= $_GET['id'] ?>">
					<input type="hidden" id="action" name="action" value="okload">
					<input type="submit" value="Next">
				</form>
			</section>
		</main>
	</body>
</html>