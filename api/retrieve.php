<?php
	header("Content-Type: application/json; charset=UTF-8");
	header("Access-Control-Allow-Methods: GET,OPTIONS");
	header("Access-Control-Allow-Headers: Authorization");
	header("Access-Control-Max-Age: 600");
	
	// username and password are passed in authorization basic header
	list($username, $password) = explode(':' , base64_decode(substr($_SERVER['HTTP_AUTHORIZATION'], 6)));
	
	include_once '../php/db.php';
	
	if (!isset($username)) {
		abort('Username not provided', 401);
	}
	
	if (!isset($password)) {
		abort('Password identifier not provided', 401);
	}
	
	if (!$_GET['pubid']) {
		abort('Publication identifier not provided', 400);
	}
	
	$db = new SMART_DB();
	
	if (!$db->connect()) {
		abort('Database not available', 500);
	}
	
	if (!$db->prepare("SELECT t1.password, t2.evaluation FROM users AS t1 LEFT JOIN evaluations AS t2 ON t1.username = t2.username WHERE t2.username = ? AND t2.uid = ?")) {
		abort('Unable to confirm user identity (prepare)', 500);
	}
	
	if (!$db->bind_param("ss", array($username, $_GET['pubid']))) {
		abort('Unable to confirm user identity (bind)', 500);
	}
	
	if (!$db->execute()) {
		abort('Unable to confirm user identity (execute)', 500);
	}
	
	$result = $db->get_result();
	
	if (!isset($result['password']) || !password_verify($password, $result['password'])) {
		abort('Invalid password provided or user does not exist.', 401);
	}
	
	http_response_code(200);
	echo $result['evaluation'];
	
	
	
	function abort($msg, $http_code) {
		http_response_code($http_code);
		echo '{"error": "' . $msg . '"}';
		exit();
	}

?>