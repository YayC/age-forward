<?php


require "twilio-php-master/Services/Twilio.php";
include "messages.php";

$first = true;

if (strlen($_REQUEST['exten'])) {
	$exten=$_REQUEST['exten'];
} else {
	$response = new Services_Twilio_Twiml();
	$response->say("An error occured in the voicemail system");
	die((string) $response);
}

$messages = array();
$total_messages = 0;

if (strlen($_REQUEST['messages'])) {
	$msg_list = $_REQUEST['messages'];
	$messages = preg_split("/,/",$_REQUEST['messages']);
	$total_messages = count($messages);
}

$current_msg = 0;
if (strlen($_REQUEST['current_msg'])) {
	$current_msg = $_REQUEST['current_msg'];
	$first = false;
}

if (strlen($_REQUEST['Digits'])) {
	$digits = $_REQUEST['Digits'];

	if($digits == 1){
		//skip
	} else if ($digits == 2){
		//save
		updateMessageFlag($messages[$current_msg],1);
	} else if ($digits == 3){
		//delete
		updateMessageFlag($messages[$current_msg],2);
	}

	if($current_msg + 1 < $total_messages) {
		$current_msg++;
	} else {
		$response = new Services_Twilio_Twiml();
		$response->say("There are no more messages");
		$response->say("Main menu");
		$response->redirect("get_mailbox.php");
		print $response;
		exit();
	}
}

$flag = 0;

if (strlen($_REQUEST['flag'])) {
	$flag = $_REQUEST['flag'];
}

$msg = getMessage($messages[$current_msg]);

$url = $msg['url'];
$from = $msg['from'];
$date = $msg['date'];
$msg_list = urlencode($msg_list);

$response = new Services_Twilio_Twiml();
$gather = $response->gather(
	array(
		"action" => "listen.php?exten=$exten&messages=$msg_list"
			. "&current_msg=$current_msg",
		"numDigits" => "1",
		"timeout" => "5",
	)
);

if($first) {
	$gather->say("Press 1 to skip, 2 to save, 3 to delete");
} else {
	$gather->say("Next Message");
}

$message = "Message from $from received on "
	. date('l jS \of F Y h:i A', strtotime($date));

$gather->say($message);
$gather->play($url);
$gather->redirect("listen.php?exten=$exten&messages=$msg_list"
	. "&current_msg=$current_msg&Digits=1");

print $response;

?>

