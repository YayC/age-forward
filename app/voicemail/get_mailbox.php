<?php

require "twilio-php-master/Services/Twilio.php";
require "messages.php";

$error=false;

if (strlen($_REQUEST['Digits'])) {
	$exten = $_REQUEST['Digits'];
	$mailbox = getMailbox($exten);
	if ($mailbox===false) {
		$error=true;
	}else {
		header("location: get_passcode.php?exten=$exten");
		exit();
	}
}

$response = new Services_Twilio_Twiml();

if ($error) {
	$response->say('Mailbox not found');
} else {
	$response->gather()
		->say('Enter your mailbox extension and press the pound key');
}

print $response;

?>