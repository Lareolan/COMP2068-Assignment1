<!-- 
    Filename: mail.php
    Author: Konstantin Koton
    Website: Konstantin's Portfolio Site
    Created on : 27-Sep-2014, 2:00:00 PM
    This PHP file is a simple E-Mail script
-->
<?php
    $to = "200278361@student.georgianc.on.ca";

    $subject = $_POST["subject"];

    $headers = "From: " . strip_tags($_POST["email"]) . "\r\n";
    $headers .= "Reply-To: ". strip_tags($_POST["email"]) . "\r\n";
    $headers .= "MIME-Version: 1.0\r\n";
    $headers .= "Content-Type: text/html; charset=ISO-8859-1\r\n";

    $message = "<html><body>";
    $message .= "<table rules=\"all\" style=\"border-color: #666;\" cellpadding=\"10\">";
    $message .= "<tr style='background: #eee;'><td><strong>Name:</strong> </td><td>" . strip_tags($_POST["name"]) . "</td></tr>";
    $message .= "<tr><td><strong>Email:</strong> </td><td>" . strip_tags($_POST["email"]) . "</td></tr>";
    $messageBody = htmlentities($_POST["message"]);
    if (($messageBody) != '') {
        $message .= "<tr><td><strong>Message Content:</strong> </td><td>" . $messageBody . "</td></tr>";
    }
    $message .= "</table>";
    $message .= "</body></html>";

    mail($to, $subject, $message, $headers);
    
?>