<?php require_once 'users/init.php' ?>
<?php require_once 'php/version.php' ?>
<?php if (!securePage($_SERVER['PHP_SELF'])) { die(); } ?>

<?php require_once 'php/db.php' ?>

<?php
	require_once("users/vendor/autoload.php");
	use PHPMailer\PHPMailer\PHPMailer;
	use PHPMailer\PHPMailer\Exception;
?>

<html>
<head>
	<meta charset="utf-8"/>
	<title>Account Delete Request - Ace SMART</title>
	<link rel="stylesheet" type="text/css" href="css/a11y.css<?= '?v=' . $smart_version ?>"/>
	<link rel="stylesheet" type="text/css" href="css/tabs.css<?= '?v=' . $smart_version ?>"/>
	<style>
		section {
			padding: 2rem;
		}
	</style>
</head>
<body>
	<header>
		<div class="id">You are logged in as <code><a target="_blank" href="users/account.php"><?php echo $user->data()->username; ?></a></code> <a class="logout" href="users/logout.php">Log out</a></div>
		
		<h1><span property="dcterms:publisher"><img class="logo" src="images/daisy_logo.png" alt="DAISY Consortium"/></span> <span property="dcterms:title">Ace <span class="smart_hd">SMART</span></span></h1>
	</header>
	
	<main>
		<section>
			<h2>Account Delete Request</h2>
<?php
if(!empty($_POST)) {
	if(!empty($_POST['delete_user'])){
	
		$mail = new PHPMailer;
		
		$db = new SMART_DB();
		$db->connect();
		$result = null;
		
		if ($db->prepare("SELECT smtp_server, useSMTPauth, email_login, email_pass, transport, from_email, from_name FROM email")) {
		    $db->execute();
			$result = $db->get_result();
		}
		
		if ($result === null) {
			echo '<p>An error occurred with your request. Please try again.</p>';
		}
		
		else {
			$mail->isSMTP();
			$mail->SMTPDebug = false;
			$mail->Host = $result['smtp_server'];
			$mail->SMTPAuth = $result['useSMTPauth'];
			$mail->Username = $result['email_login'];
			$mail->Password = htmlspecialchars_decode($result['email_pass']);
			$mail->SMTPSecure = $result['transport'];
			
			$mail->From = $result['from_email'];
			$mail->FromName = $result['from_name'];
			$mail->addAddress('matt.garrish@gmail.com', 'Matt Garrish');
			
			$mail->isHTML(true);
			
			$mail->Subject = 'Ace SMART Account Deletion Request';
			$mail->Body    = '<ul><li>Username: ' . $user->data()->username . '</li><li>User ID: ' . $user->data()->id . '</li><li>Email: ' . $user->data()->email . '</li></ul>';
			
			if(!$mail->send()) {
				echo '<p>An error occurred sending your request. Please try again.</p>';
				//echo '<p>' . $mail->ErrorInfo . '</p>';
			}
			else {
				echo '<p>Your request to delete your Ace SMART account has been submitted.</p><p>Requests are typically processed within two weeks of submission.</p>';
			}
		}
		
	    $db->close();
	}
	
	else {
		echo '<p>Invalid request. Account deletion requests can only be made from your account profile page.</p>';
	}
}

else {
	echo '<p>Invalid request. This page can only be accessed by an authorized user.</p>';
}
?>
	
		</section>
	</main>
		
	<footer>
		<p>Copyright &#169; <span property="dcterms:dateCopyrighted">2017</span> <a target="_blank" href="http://daisy.org">DAISY Consortium</a>. All Rights Reserved.</p>
		<p><a target="_blank" href="http://www.github.com/DAISY/ace-smart/issues">Report a problem</a> | <a target="_blank" href="http://www.daisy.org/terms-use">Terms of Use</a></p>
	</footer>
</body>
</html>
