<?php
	
	if ($_FILES['ace-report']['error'] == UPLOAD_ERR_OK && is_uploaded_file($_FILES['ace-report']['tmp_name'])) {
		echo file_get_contents($_FILES['ace-report']['tmp_name']); 
	}
	else {
		echo '{"error": true}';
	}
?>