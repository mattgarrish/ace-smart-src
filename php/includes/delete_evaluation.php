
<?php
	
	# delete evaluation
	
	if (isset($_POST['action']) && $_POST['action'] == 'delete') {
	
		$db = new SMART_DB();
		$db->connect();
		
		if ($db->prepare("UPDATE reports SET status = ?, report = ?, modified = ? WHERE username = ? AND id = ?")) {
			$del_date = '0000-00-00 00:00:00';
			$del_data = '';
			$del_status = 'deleted';
			$db->bind_param("ssssi", array($del_status, $del_data, $del_date, $user->data()->username, $_POST['id']));
		    $db->execute();
		    $db->close();
		}
	}
	
?>
