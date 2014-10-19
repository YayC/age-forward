<?php

require "twilio-php-master/Services/Twilio.php";
include "messages.php";

$exten = $_REQUEST['exten'];
$url = $_REQUEST['RecordingUrl'];
$caller_id = $_REQUEST['Caller'];

if (strlen($exten) && strlen($url)) {
	//save recording url and callerid as a message for that mailbox extension
	addMessage($exten, $caller_id, $url);

	$response = new Services_Twilio_Twiml();
	$response->say('Thank you, good bye');
	print $response;
}

?>