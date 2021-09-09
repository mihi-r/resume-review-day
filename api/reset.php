<?php
error_reporting(-1);

set_include_path('./includes/');
require_once('mysqli.php');

$username = $_POST['usernameText'];
$password = $_POST['passwordText'];

$data = array(
    'name' => $username,
    'pass' => $password
);

$payload = json_encode($data);

$ch = curl_init('https://tribunal.uc.edu/user/login?_format=json');
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLINFO_HEADER_OUT, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $payload);

curl_setopt($ch, CURLOPT_HTTPHEADER, array(
    'Content-Type: application/json',
    'Content-Length: ' . strlen($payload))
);

$result = curl_exec($ch);

curl_close($ch);

$json = json_decode($result);
$is_authenticated = false;

// Authenticate user
if (is_object($json)) {
    if (property_exists($json, 'current_user')) {
        if (is_object($json->current_user)) {
            if (property_exists($json->current_user, 'roles')) {
                if (is_array($json->current_user->roles)) {
                    if (in_array('administrator', $json->current_user->roles) || in_array('career_fair_editor', $json->current_user->roles)) {
                        $is_authenticated = true;
                    }
                }
            }
        }
    }
}

if (!isset($result_data))
    $result_data = new stdClass();
$result_data->status = 'error';

if (!$is_authenticated) {
    $result_data->data = 'The username or password is incorrect.';
    echo(json_encode($result_data));
} else {
    // Delete all resumes
    foreach (new DirectoryIterator('../resumes') as $fileInfo) {
        if(!$fileInfo->isDot()) {
            if (!unlink($fileInfo->getPathname())) {
                $result_data->data = 'A resume could not be deleted. Aborting...';
                echo(json_encode($result_data));
                die();
            }
        }
    }

    // Delete database entries from employers
    $sql = 'TRUNCATE TABLE resume_review_employers';
    $result = $mysqli->query($sql);
    if (!$result) {
        $result_data->data = 'Employers table could not be truncated. Aborting...';
        echo(json_encode($result_data));
        die();
    }

    // Delete database entries from students
    $sql = 'TRUNCATE TABLE resume_review_students';
    $result = $mysqli->query($sql);
    if (!$result) {
        $result_data->data = 'Students table could not be truncated. Aborting...';
        echo(json_encode($result_data));
        die();
    }

    $result_data->status = 'success';
    echo(json_encode($result_data));
}

?>