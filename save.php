<?php require_once 'modules/db.php' ?>
<?php

	if (!isset($_POST['location'])) {
		echo '{"error": "Unknown save location. Please try again."}';
		die();
	}
	
	$dateTime = new DateTime();
	
	if ($_POST['location'] == 'db') {
		
		if (!isset($_POST['u']) || !isset($_POST['id']) || !isset($_POST['report'])) {
			echo '{ "error": "Invalid information. Unable to save evaluation. Please try again." }';
			die();
		}
		
		$db = new SMART_DB();
		
		if (!$db->connect()) {
			echo '{ "error": "Save functionality is currently unavailable. Please try again." }';
			die();
		}
		
		if (!$db->prepare("UPDATE reports SET modified = ?, report = ? WHERE username = ? AND id = ?")) {
			echo '{ "error": "Failed to save evaluation. Please try again." }';
			die();
		}
		
		$now = date("Y-m-d H:i:s");
		
		if (!$db->bind_param("sssi", array($now, $_POST['report'], $_POST['u'], $_POST['id']))) {
			echo '{ "error": "An error occurred while preparing to save evaluation. Please try again." }';
			die();
		}
		
	    if (!$db->execute()) {
			echo '{ "error": "An error occurred saving the evaluation. Please try again." }';
			die();
	    }
	    
	    $db->close();
		
		echo '{ "status": "Evaluation successfully saved." }';
	}
	
	else {
		$title = $_POST['title'] ? $_POST['title'] : 'ace-smart-evaluation-';
		$title .= $dateTime->format('Ymd');
		$title .= '.json';
		
		header('Content-Disposition: attachment; filename="' . $title . '"');
		header('Content-Type: application/json');
		header('Content-Length: ' . strlen($_POST['report']));
		header('Connection: close');
		
		echo $_POST['report'];
	}
	
?>