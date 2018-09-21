
<?php

	$db = new SMART_DB();
	$ext = new SMART_EXTENSIONS();
	
	if (!$db->connect()) {
		header("Location: index.php?error=db");
		die();
	}
	
	$smart = true;
	$report = '';
	
	if ($_POST['action']) {
		
		if ($_POST['action'] == 'load') {
			if ($_FILES['ace-report']['error'] == UPLOAD_ERR_OK && is_uploaded_file($_FILES['ace-report']['tmp_name'])) {
				$report = file_get_contents($_FILES['ace-report']['tmp_name']); 
			}
		}
		
		else if ($_POST['action'] == 'resume' && $_POST['id']) {
			
			if ($_FILES['ace-report']['error'] == UPLOAD_ERR_OK && is_uploaded_file($_FILES['ace-report']['tmp_name'])) {
				$report = file_get_contents($_FILES['ace-report']['tmp_name']); 
			}
			
			else {
			
				if ($db->prepare("SELECT report FROM reports WHERE username = ? AND id = ?")) {
				
					if (!$db->bind_param("si", array($user->data()->username, $_POST['id']))) {
						header("Location: index.php");
						die();
					}
					
					if (!$db->execute()) {
						header("Location: index.php");
						die();
					}
					
					$result = $db->get_result();
					
					$report = $result['report'];
					
					$db->close();
				
				}
			}
		}
		
		else {
			header("Location: index.php");
			die();
		}
	}
	
	else {
		header("Location: index.php");
		die();
	}
	
	if ($report == '') {
		header("Location: index.php");
		die();
	}
?>

