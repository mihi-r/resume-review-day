<?php
error_reporting(-1);

set_include_path('./includes/');
require_once('mysqli.php');

DEFINE('RESUME_FILE_DIR', '../resumes');

$filename = RESUME_FILE_DIR . '/resume.zip';
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
    header('Content-Type: application/json');
    $result_data->data = 'The username or password is incorrect.';
    echo(json_encode($result_data));
} else {
    $sql = "SELECT s.time, s.slot, s.company_id, s.resume, e.name AS ename, s.name AS sname\n"
        . "FROM resume_review_students AS s, resume_review_employers AS e\n"
        . "WHERE s.company_id = e.id";

    $result = $mysqli->query($sql);

    if ($result) {
        $zip = new ZipArchive;

        if ($stat = $zip->open($filename, ZipArchive::CREATE) === TRUE) {
            while ($row = $result->fetch_assoc()) {
                if ($row['resume'] != '') {
                    if ($row['slot'] === '') {
                        $dir_path = preg_replace('/[^A-Za-z0-9_\-]/', '_', $row['ename']) . '/'
                            . preg_replace('/[^A-Za-z0-9_\-]/', '_', $row['time']);
                    } else {
                        $dir_path = preg_replace('/[^A-Za-z0-9_\-]/', '_', $row['ename']);
                    }

                    if (!is_dir($dir_path)) {
                        mkdir($dir_path, 0775, true);
                    }

                    $student_name = preg_replace('/[^A-Za-z0-9_\-]/', '_', $row['sname']);

                    if (file_exists($row['resume'])) {
                        $zip->addFile($row['resume'], $dir_path . '/resume' . $row['slot'] . '-' . $student_name . '.pdf');
                    }
                }
            }

            $zip->close();
        } else {
            $result_data->data = $stat;
            echo(json_encode($result_data));
        }
        $result->close();
    }

    if (file_exists($filename)) {
        header('Content-Type: application/zip');
        header('Content-Disposition: attachment; filename=' . basename($filename));
        header('Content-Length: ' . filesize($filename));
        flush();
        readfile($filename);
        unlink($filename);
    }

    mysqli_close($mysqli);
}
?>