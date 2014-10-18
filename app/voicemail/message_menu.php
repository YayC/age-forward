<?php

require "twilio-php-master/Services/Twilio.php";
include "messages.php";

if (strlen($_REQUEST['exten'])){
	$exten=$_REQUEST['exten'];
} else {
	$response = new Services_Twilio_Twiml();
	$response->say("An error occured in the voicemail system");
	die((string) $response);
}

if (strlen($_REQUEST['Digits'])){
	$digits = $_REQUEST['Digits'];
	if ($digits == 1 || $digits == 2) {
		$messages = getMessages($exten, $digits - 1);
		$location = "location: listen.php?exten=$exten&messages="
			. urlencode(implode(",",$messages));
		header($location);
		exit();
	} else {
		$error=true;
	}
}

$messages = getMessages($exten, 0);
$new_msgs = count($messages);

$response = new Services_Twilio_Twiml();

if($error)
	$response->say('That was not a valid option');

$gather = $response->gather(array("numDigits" => "1"));
$gather->say("You have $new_msgs new messages");
$gather->say("To listen to new messages press 1.");
$gather->say("To listen to saved messages press 2.");
$response->say("Goodbye");
print $response;

?>
