<?php
 
require "../twilio-php/Services/Twilio.php";
 
// set your AccountSid and AuthToken from www.twilio.com/user/account
$AccountSid = "AC6259244daef6aaa1c6a810a285b5a085";
$AuthToken = "f90fc825d2e2a5af1b7f10feffaa99ab";
 
$client = new Services_Twilio($AccountSid, $AuthToken);
 
$message = $client->account->messages->create(array(
    "From" => "484-588-2789",
    "To" => "484-432-9849",
    "Body" => "Test message!",
));
 
// Display a confirmation message on the screen
echo "Sent message {$message->sid}";
?>