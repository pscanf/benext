<?php
	$to = "paolo.scanferla@gmail.com";
	$subject = "QUESTION FROM THE FORM";
	$from = "form@lastminutelines.com";
	$message = $_POST['message'];
	mail($to, $subject, $message);
	echo "QUESTIONASKED";
?>
