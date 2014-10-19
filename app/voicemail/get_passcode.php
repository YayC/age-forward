<?php

require "twilio-php-master/Services/Twilio.php";
include "messages.php";

if(strlen($_REQUEST['exten'])){
	$exten=$_REQUEST['exten'];
} else {
	$response = new Services_Twilio_Twiml();
	$response->say("An error occured in the voicemail system");
	die((string) $response);
}

if(strlen($_REQUEST['Digits'])){
	$code = $_REQUEST['Digits'];
	$mailbox = getMailbox($exten);
	if($mailbox['passcode']!=$code) {
		$error=true;
	} else {
		header("location: message_menu.php?exten=$exten");
		exit();
	}
}

$response = new Services_Twilio_Twiml();

if ($error) {
	$response->say('Passcode incorrect, please try again');
} else {
	$response->gather()
		->say("Enter the passcode for mailbox $exten");
}

print $response;

?>
