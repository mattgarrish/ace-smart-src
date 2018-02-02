<?php

	header('Content-Disposition: attachment; filename="ace-smart-evaluation.json"');
	header('Content-Type: application/json');
	header('Content-Length: ' . strlen($_POST['report']));
	header('Connection: close');
	
	echo $_POST['report'];

?>