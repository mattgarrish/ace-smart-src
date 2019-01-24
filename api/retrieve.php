<?php

	require_once 'modules/headers.php';

	require_once 'modules/authenticate.php';
	require_once 'modules/retrieval.php';
	
	// verify the request comes from an authorized user
	$auth = new SMART_AUTH();
	$auth->verify($_SERVER['HTTP_AUTHORIZATION']);
	
	// retrieve and return the requested evaluation
	$retrieve = new SMART_RETRIEVE();
	$retrieve->init($auth->get_username());
	$retrieve->get_evaluation();

?>