<!DOCTYPE html>
<html lang="en">
	<head>
		<title><?php echo $_POST['title'] ?></title>
		<meta charset="utf-8"/>
		<link rel="stylesheet" type="text/css" href="https://cdn.datatables.net/1.10.15/css/dataTables.bootstrap4.min.css"/>
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous"/>
		<link rel="stylesheet" type="text/css" href="http://<?php echo $_SERVER["HTTP_HOST"]; ?>/css/report.css"/>
		<?php
			if ($_POST['modules']) {
				foreach (explode(',', $_POST['modules']) as $module) {
					echo '<link rel="stylesheet" type="text/css" href="http://' . $_SERVER["HTTP_HOST"] . '/extensions/' . $module . '/css/report.css?' . time() . '"/>';
				}
			}
		?>
		<link rel="stylesheet" type="text/css" href="http://<?php echo $_SERVER["HTTP_HOST"]; ?>/css/tabs.css"/>
		<meta name="viewport" content="width=device-width, initial-scale=1"/>
	</head>
	<body typeof="Book" vocab="https://schema.org">
		<header>
			<h1>EPUB Accessibility Conformance Report</h1>
			<div id="add-logo"><?php echo $_POST['logo'] ?></div>
		</header>
		
		<main class="js-tabs"><?php echo $_POST['report'] ?></main>
		
		<footer>
			<p id="timestamp">Generated <span id="date-created"><?php echo $_POST['timestamp'] ?></span> using <a href="http://smart.daisy.org">Ace SMART</a></p>
			<p><a href="http://daisy.org"><img src="http://smart.daisy.org/images/daisy_logo.gif" alt="DAISY"/></a></p>
		</footer>
		<script src="https://code.jquery.com/jquery-3.2.1.slim.min.js" integrity="sha384-KJ3o2DKtIkvYIK3UENzmM7KCkRr/rE9/Qpg6aAZGJwFDMVNA/GpGFF93hXpG5KkN" crossorigin="anonymous"></script>
		<script src="https://cdn.datatables.net/1.10.15/js/jquery.dataTables.min.js"></script>
		<script src="https://cdn.datatables.net/1.10.15/js/dataTables.bootstrap4.min.js"></script>
		<script>
			$(document).ready(function() {
				$('#conformance table').DataTable({
					"paging": false,
					"info": false
				});
			});
		</script>
		<script src="http://<?php echo $_SERVER["HTTP_HOST"]; ?>/js/a11ytabs.js"></script>
	</body>
</html>
