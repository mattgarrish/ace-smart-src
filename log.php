<?php require_once 'modules/db.php' ?>
<?php

	$user = $_POST['u'] ? $_POST['u'] : '';
	$company = $_POST['c'] ? $_POST['c'] : '';
	$title = $_POST['t'] ? $_POST['t'] : 'Untitled';
	$now = date("Y-m-d H:i:s");
	$modified = '0000-00-00 00:00:00';
	$status = 'unsaved';
	
	$db = new SMART_DB();
	$db->connect();
	
	if ($db->prepare("INSERT INTO reports (username, company, title, created, modified, status) VALUES (?, ?, ?, ?, ?, ?)")) {
	
		if (!$db->bind_param("ssssss", array($user, $company, $title, $now, $modified, $status))) {
		    echo '{ "error": "Failed to bind parameters ' . json_encode($stmt->error) . '" }';
		    die();
		}
		
	    if (!$db->execute()) {
		    echo '{ "error": "Failed to execute ' . json_encode($stmt->error) . '" }';
		    die();
	    }
	    
	    $db->close();
	    
	    $id = $db->insert_id();
	    
	    echo '{ "report": "New report logged", "id": "' . $id . '" }';
	}
	
	else {
		echo '{ "error": "Failed to prepare statement. ' . json_encode($mysqli->error) . '" }';
	}

?>