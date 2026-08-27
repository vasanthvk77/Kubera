<?php
// Prevent PHP from outputting HTML warnings which break the JSON response
error_reporting(E_ALL);
ini_set('display_errors', '0');
date_default_timezone_set('UTC'); // Fixes warning for date() if timezone isn't set in php.ini

// Allow cross-origin requests for local testing (React frontend)
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    header("HTTP/1.1 200 OK");
    exit();
}

/**
 * Enhanced SMTP Mailer Class
 * Handles authenticated SMTP without external dependencies
 */
class SimpleSMTP {
    private $host;
    private $port;
    private $user;
    private $pass;
    private $lastError = "";

    public function __construct($host, $port, $user, $pass) {
        $this->host = $host;
        $this->port = (int)$port;
        $this->user = $user;
        $this->pass = $pass;
    }

    public function getLastError() {
        return $this->lastError;
    }

    public function send($toAddresses, $subject, $htmlContent, $plainTextContent, $fromName) {
        $timeout = 10;
        $boundary = "----=_Part_" . md5(time());

        // SSL context - disabling peer verification for local dev compatibility
        $context = stream_context_create([
            'ssl' => [
                'verify_peer'       => false,
                'verify_peer_name'  => false,
                'allow_self_signed' => true,
            ]
        ]);

        if ($this->port == 465) {
            $socket = @stream_socket_client("ssl://{$this->host}:{$this->port}", $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
        } else {
            $socket = @stream_socket_client("tcp://{$this->host}:{$this->port}", $errno, $errstr, $timeout, STREAM_CLIENT_CONNECT, $context);
        }

        if (!$socket) {
            $this->lastError = "SMTP Connection Error: $errstr ($errno)";
            return false;
        }

        if (!$this->expect($socket, "220")) return false;
        if (!$this->sendCommand($socket, "EHLO " . $this->host, "250")) return false;

        if ($this->port == 587) {
            if (!$this->sendCommand($socket, "STARTTLS", "220")) return false;
            if (!stream_socket_enable_crypto($socket, true, STREAM_CRYPTO_METHOD_TLS_CLIENT)) {
                $error = error_get_last();
                $this->lastError = "TLS Encryption failed. " . ($error ? $error['message'] : '');
                return false;
            }
            if (!$this->sendCommand($socket, "EHLO " . $this->host, "250")) return false;
        }

        if (!$this->sendCommand($socket, "AUTH LOGIN", "334")) return false;
        if (!$this->sendCommand($socket, base64_encode($this->user), "334")) return false;
        if (!$this->sendCommand($socket, base64_encode($this->pass), "235")) {
            $this->lastError = "Authentication failed";
            return false;
        }

        if (!$this->sendCommand($socket, "MAIL FROM: <{$this->user}>", "250")) return false;
        
        foreach ((array)$toAddresses as $to) {
            if (!$this->sendCommand($socket, "RCPT TO: <{$to}>", "250")) return false;
        }

        if (!$this->sendCommand($socket, "DATA", "354")) return false;

        $headers = "MIME-Version: 1.0\r\n";
        $headers .= "To: " . (is_array($toAddresses) ? implode(', ', $toAddresses) : $toAddresses) . "\r\n";
        $headers .= "From: $fromName <{$this->user}>\r\n";
        $headers .= "Subject: $subject\r\n";
        $headers .= "Date: " . date('r') . "\r\n";
        $headers .= "X-Mailer: SimpleSMTP\r\n";
        $headers .= "Content-Type: multipart/alternative; boundary=\"$boundary\"\r\n";

        $body = "--$boundary\r\n";
        $body .= "Content-Type: text/plain; charset=utf-8\r\n";
        $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $body .= $plainTextContent . "\r\n\r\n";
        $body .= "--$boundary\r\n";
        $body .= "Content-Type: text/html; charset=utf-8\r\n";
        $body .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
        $body .= $htmlContent . "\r\n\r\n";
        $body .= "--$boundary--";

        fputs($socket, $headers . "\r\n" . $body . "\r\n.\r\n");
        if (!$this->expect($socket, "250")) return false;

        $this->sendCommand($socket, "QUIT", "221");
        fclose($socket);
        return true;
    }

    private function sendCommand($socket, $cmd, $expected) {
        fputs($socket, $cmd . "\r\n");
        return $this->expect($socket, $expected);
    }

    private function expect($socket, $code) {
        $response = "";
        while ($line = @fgets($socket, 515)) {
            $response .= $line;
            if (isset($line[3]) && $line[3] == " ") break;
        }
        if (substr($response, 0, 3) !== $code) {
            $this->lastError = "Expected $code but received: " . $response;
            return false;
        }
        return true;
    }
}

// -------------------------------------------------------------------
// EMAIL CONFIGURATION — loaded from shared email_config.php
// -------------------------------------------------------------------
$configPath = __DIR__ . '/email_config.php';
if (!file_exists($configPath)) {
    echo json_encode(["status" => "error", "message" => "Email config file not found."]);
    exit();
}
$config = include $configPath;
if (!$config) {
    echo json_encode(["status" => "error", "message" => "Invalid email config PHP."]);
    exit();
}

$emailConfig = [
    'host'     => $config['smtp']['host'],
    'port'     => (int)$config['smtp']['port'],
    'username' => $config['smtp']['username'],
    'password' => $config['smtp']['password'],
    'fromName' => $config['smtp']['fromName'],
];
$toEmails = $config['toEmails'];
// -------------------------------------------------------------------

// Retrieve POST data
$data = json_decode(file_get_contents("php://input"), true);

if (!$data) {
    echo json_encode(["status" => "error", "message" => "No data provided."]);
    exit();
}

$name        = isset($data['name'])        ? trim($data['name'])        : '';
$company     = isset($data['company'])     ? trim($data['company'])     : '';
$position    = isset($data['position'])    ? trim($data['position'])    : '';
$email       = isset($data['email'])       ? trim($data['email'])       : '';
$phone       = isset($data['phone'])       ? trim($data['phone'])       : '';
$country     = isset($data['country'])     ? trim($data['country'])     : '';
$enquiryType = isset($data['enquiryType']) ? $data['enquiryType']        : [];
$message     = isset($data['message'])     ? trim($data['message'])     : '';

// --- Server-side validation ---
$validationErrors = [];
if (empty($name))                           $validationErrors[] = "Full Name is required.";
if (empty($email))                          $validationErrors[] = "Email Address is required.";
elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) $validationErrors[] = "Invalid email address.";
if (empty($phone))                          $validationErrors[] = "Phone Number is required.";
if (empty($country))                        $validationErrors[] = "Country / Region is required.";
if (empty($message))                        $validationErrors[] = "Message is required.";

if (!empty($validationErrors)) {
    http_response_code(400);
    echo json_encode(["status" => "error", "message" => implode(" ", $validationErrors)]);
    exit();
}

// Sanitize after validation
$name     = htmlspecialchars($name);
$company  = htmlspecialchars($company);
$position = htmlspecialchars($position);
$email    = htmlspecialchars($email);
$phone    = htmlspecialchars($phone);
$country  = htmlspecialchars($country);
$messageRaw = $message; // Keep raw for text version
$message  = htmlspecialchars($message);

$enquiryTypeSanitized = [];
if (is_array($enquiryType) && !empty($enquiryType)) {
    foreach ($enquiryType as $item) {
        $enquiryTypeSanitized[] = htmlspecialchars(trim($item));
    }
}
$enquiryTypeDisplay = !empty($enquiryTypeSanitized) ? implode(', ', $enquiryTypeSanitized) : 'General Enquiry (no specific products selected)';

$mailer = new SimpleSMTP($emailConfig['host'], $emailConfig['port'], $emailConfig['username'], $emailConfig['password']);

// PROFESSIONAL HTML TEMPLATE
$messageHtml = nl2br($message);
$currentYear = date('Y');

$htmlContent = <<<HTML
<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<title>Inquiry Received</title>
</head>
<body style="margin: 0; padding: 30px 15px; background: #f5f5f5; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #222;">

<div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 8px 25px rgba(0,0,0,0.08); border: 1px solid #ececec;">

    <!-- Header -->
    <div style="text-align: center; padding: 28px 30px 20px; border-bottom: 1px solid #ececec; background: #ffffff;">
        <h1 style="margin: 0; font-size: 28px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: linear-gradient(to right, #303030ff 0%, #1f1f1fff 50%, #ebd461ff 50%, #e3a106ff 100%);">Inquiry Received</h1>
        <div style="width: 120px; height: 3px; margin: 12px auto 0; background: linear-gradient(to right, #303030ff 0%, #1f1f1fff 50%, #ebd461ff 50%, #e3a106ff 100%); border-radius: 10px;"></div>
    </div>

    <!-- Content -->
    <div style="padding: 35px;">

        <div style="font-size: 17px; font-weight: 700; text-transform: uppercase; color: #111; margin: 0 0 20px; letter-spacing: 0.5px;">
            Contact Details
        </div>

        <table cellpadding="0" cellspacing="0" border="0" width="100%" style="width: 100%; border-collapse: collapse;">
            <tr style="border-bottom: 1px solid #efefef;">
                <td style="padding: 16px 0; width: 42px; vertical-align: top;">
                    <div style="width: 42px; height: 42px; border: 1px solid #cfcfcf; border-radius: 6px; text-align: center; line-height: 42px; font-size: 18px; color: #111; background: #fff;">👤</div>
                </td>
                <td style="padding: 16px 0 16px 15px; vertical-align: middle;">
                    <span style="display: block; font-size: 11px; font-weight: 700; color: #777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Full Name</span>
                    <span style="font-size: 15px; font-weight: 600; color: #111;">{$name}</span>
                </td>
            </tr>

            <tr style="border-bottom: 1px solid #efefef;">
                <td style="padding: 16px 0; width: 42px; vertical-align: top;">
                    <div style="width: 42px; height: 42px; border: 1px solid #cfcfcf; border-radius: 6px; text-align: center; line-height: 42px; font-size: 18px; color: #111; background: #fff;">🏢</div>
                </td>
                <td style="padding: 16px 0 16px 15px; vertical-align: middle;">
                    <span style="display: block; font-size: 11px; font-weight: 700; color: #777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Company / Organization</span>
                    <span style="font-size: 15px; font-weight: 600; color: #111;">{$company}</span>
                </td>
            </tr>

            <tr style="border-bottom: 1px solid #efefef;">
                <td style="padding: 16px 0; width: 42px; vertical-align: top;">
                    <div style="width: 42px; height: 42px; border: 1px solid #cfcfcf; border-radius: 6px; text-align: center; line-height: 42px; font-size: 18px; color: #111; background: #fff;">💼</div>
                </td>
                <td style="padding: 16px 0 16px 15px; vertical-align: middle;">
                    <span style="display: block; font-size: 11px; font-weight: 700; color: #777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Position</span>
                    <span style="font-size: 15px; font-weight: 600; color: #111;">{$position}</span>
                </td>
            </tr>

            <tr style="border-bottom: 1px solid #efefef;">
                <td style="padding: 16px 0; width: 42px; vertical-align: top;">
                    <div style="width: 42px; height: 42px; border: 1px solid #cfcfcf; border-radius: 6px; text-align: center; line-height: 42px; font-size: 18px; color: #111; background: #fff;">✉</div>
                </td>
                <td style="padding: 16px 0 16px 15px; vertical-align: middle;">
                    <span style="display: block; font-size: 11px; font-weight: 700; color: #777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Email Address</span>
                    <span style="font-size: 15px; font-weight: 600; color: #111;">
                        <a href="mailto:{$email}" style="color: #111; text-decoration: none;">{$email}</a>
                    </span>
                </td>
            </tr>

            <tr style="border-bottom: 1px solid #efefef;">
                <td style="padding: 16px 0; width: 42px; vertical-align: top;">
                    <div style="width: 42px; height: 42px; border: 1px solid #cfcfcf; border-radius: 6px; text-align: center; line-height: 42px; font-size: 18px; color: #111; background: #fff;">☎</div>
                </td>
                <td style="padding: 16px 0 16px 15px; vertical-align: middle;">
                    <span style="display: block; font-size: 11px; font-weight: 700; color: #777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Phone Number</span>
                    <span style="font-size: 15px; font-weight: 600; color: #111;">{$phone}</span>
                </td>
            </tr>

            <tr style="border-bottom: 1px solid #efefef;">
                <td style="padding: 16px 0; width: 42px; vertical-align: top;">
                    <div style="width: 42px; height: 42px; border: 1px solid #cfcfcf; border-radius: 6px; text-align: center; line-height: 42px; font-size: 18px; color: #111; background: #fff;">🌍</div>
                </td>
                <td style="padding: 16px 0 16px 15px; vertical-align: middle;">
                    <span style="display: block; font-size: 11px; font-weight: 700; color: #777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Country / Region</span>
                    <span style="font-size: 15px; font-weight: 600; color: #111;">{$country}</span>
                </td>
            </tr>

            <tr style="border-bottom: 1px solid #efefef;">
                <td style="padding: 16px 0; width: 42px; vertical-align: top;">
                    <div style="width: 42px; height: 42px; border: 1px solid #cfcfcf; border-radius: 6px; text-align: center; line-height: 42px; font-size: 18px; color: #111; background: #fff;">📦</div>
                </td>
                <td style="padding: 16px 0 16px 15px; vertical-align: middle;">
                    <span style="display: block; font-size: 11px; font-weight: 700; color: #777; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 5px;">Enquiry Type (Products)</span>
                    <span style="font-size: 15px; font-weight: 600; color: #111;">{$enquiryTypeDisplay}</span>
                </td>
            </tr>
        </table>

        <div style="margin-top: 35px; margin-bottom: 15px; font-size: 17px; font-weight: 700; text-transform: uppercase; color: #111;">
            Customer Message
        </div>

        <div style="background: #f7f7f7; border-radius: 10px; padding: 24px; position: relative; color: #444; line-height: 1.8; font-size: 15px; min-height: 40px;">
            <span style="position: absolute; top: 8px; left: 12px; font-size: 24px; font-weight: bold; color: #111;">❝</span>
            <div style="padding: 0 15px;">{$messageHtml}</div>
            <span style="position: absolute; right: 12px; bottom: 8px; font-size: 24px; font-weight: bold; color: #111;">❞</span>
        </div>

    </div>

    <div style="background: #212121ff; color: #cfcfcf; text-align: center; padding: 18px 20px; font-size: 11px; line-height: 1.8; border-bottom: 4px solid #e3a106ff;">
        &copy; {$currentYear} Kubera Resources. All rights reserved.<br>
        This is an automated notification from Kubera Resources website.
    </div>

</div>

</body>
</html>
HTML;

// PLAIN TEXT FALLBACK
$companyPlain = !empty($company) ? $company : 'Not specified';
$positionPlain = !empty($position) ? $position : 'Not specified';

$plainTextContent = "
NEW CONTACT FORM SUBMISSION
===========================

Full Name: {$name}
Company / Organization: {$companyPlain}
Position: {$positionPlain}
Email: {$email}
Phone: {$phone}
Country / Region: {$country}
Enquiry Type (Products):
---------------------------
{$enquiryTypeDisplay}
---------------------------

Message:
---------------------------
{$messageRaw}
---------------------------

Sent from Kubera Resources Website.
";

// -------------------------------------------------------------------
// SEND SUCCESS RESPONSE IMMEDIATELY
// This allows the user to see the success message without waiting 
// for the SMTP handshake which can take several seconds.
// -------------------------------------------------------------------
ignore_user_abort(true);
set_time_limit(300); // Give SMTP enough time in background

// Buffering to send response first
ob_start();
echo json_encode(["status" => "success", "message" => "Message received. We will get back to you soon!"]);
$size = ob_get_length();
header("Content-Length: $size");
header("Connection: close");
ob_end_flush();
ob_flush();
flush();

// For servers using FastCGI (like many production hosts)
if (function_exists('fastcgi_finish_request')) {
    fastcgi_finish_request();
}

// -------------------------------------------------------------------
// NOW PROCESS THE EMAIL IN THE BACKGROUND
// -------------------------------------------------------------------
$result = $mailer->send($toEmails, "New Contact Us Form Submission from $name", $htmlContent, $plainTextContent, $emailConfig['fromName']);

$logFile = __DIR__ . '/mailer_log.txt';
$timestamp = date('Y-m-d H:i:s');
$logDetails = "Name: $name | Email: $email | Country: $country | Products: $enquiryTypeDisplay";
if ($result) {
    file_put_contents($logFile, "[$timestamp] Success: Mail sent successfully to " . implode(', ', $toEmails) . " | $logDetails\n", FILE_APPEND);
} else {
    file_put_contents($logFile, "[$timestamp] Error: Mail failed to send. Error: " . $mailer->getLastError() . " | $logDetails\n", FILE_APPEND);
}

exit();
?>
