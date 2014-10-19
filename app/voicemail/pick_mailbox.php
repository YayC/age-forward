<?php

require "twilio-php-master/Services/Twilio.php";
include "messages.php";

$error = false;

//if we received an extension, attempt to look it up from the voicemailbox table
if (strlen($_REQUEST['Digits'])) {
	$exten = $_REQUEST['Digits'];

	//if the mailbox exists, redirect the call to the leave_a_message.php
	if (getMailbox($exten)) {
		header("location: leave_a_message.php?exten=$exten");
		exit();
	} else {
		$error=true;
	}
}

$response = new Services_Twilio_Twiml();
$gather = $response->gather();

if($error)
	$gather->say("Mailbox for extension $exten was not found");

$gather->say("Enter the extension you wish to leave a message for, followed by"
	. " the #sign");
$response->say('I did not receive an extension.');
$response->redirect('pick_mailbox.php');

print $response;

?>
