<?php
error_reporting(-1);

set_include_path('./includes/');
require_once('mysqli.php');
require_once('check_file.php');

DEFINE('RESUME_MAX_FILE_SIZE', 2);
DEFINE('RESUME_FILE_DIR', '../resumes');

$name = '';
$email = '';
$year = '';
$company_id = null;
$time = '';
$major = '';
$resume = null;

$name = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['nameText'])));
$email = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['emailText'])));
$year = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['yearText'])));
$company_id = (int)mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['companyIdText'])));
$time = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['timeText'])));
$major = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['majorText'])));
if (isset($_FILES['resumeFile'])) {
    $resume = $_FILES['resumeFile'];
}

$resume_mime_types = array(
    'pdf' => 'application/pdf'
);

// Initialize data validation and SQL result
if (!isset($result_data)) 
    $result_data = new stdClass();
$result_data->status = 'error';
$result_data->data = '';

// Get admin email, event date, and employer page open status
$admin_email = '';
$event_date = '';
$event_location = '';
$student_review_max = null;
$students_open = null;

$sql = 'SELECT admin_email, event_date, event_location, student_review_max, students_open FROM resume_review_info';
$result = $mysqli->query($sql);

if ($result) {
	while ($row = $result->fetch_assoc()) {
        $admin_email = $row['admin_email'];
        $event_date  = $row['event_date'];
        $event_location = $row['event_location'];
        $student_review_max = $row['student_review_max'];
        $students_open = $row['students_open'];
    }
    $result->close();
}

if ($admin_email === '' || $event_date === '' || $event_location === '' || $student_review_max === null || $students_open === null) {
    $result_data->data = 'Error occurred while retrieving admin information. Please try again. '
        . 'If the error persists, contact the email on the bottom.';
    echo json_encode($result_data);
    die();
}

if (!$students_open) {
    $result_data->data = 'Student registration is closed.';
    echo json_encode($result_data);
    die();
}

// Get representative name and company
$rep_name = '';
$company = '';

$sql = 'SELECT name, company FROM resume_review_employers WHERE id=' . $company_id;
$result = $mysqli->query($sql);

if ($result) {
	while ($row = $result->fetch_assoc()) {
        $rep_name = $row['name'];
        $company = $row['company'];
    }
    $result->close();
}

if ($rep_name === '' || $company === '') {
    $result_data->data = 'Error occurred while retrieving employer information. Please try again. '
        . 'If the error persists, contact the email on the bottom.';
    echo json_encode($result_data);
    die();
}

if ($resume) {
    // Check resume file
    $resume_check_result = checkFile($resume, RESUME_MAX_FILE_SIZE, $resume_mime_types);
    if (!$resume_check_result->file_safe) {
        $result_data->data = $resume_check_result->message;
        echo json_encode($result_data);
        die();
    }
}

// Check name
if (!preg_match("/^[\w\ \'\.]{1,256}$/", $name)) {
    $result_data->data = 'Your name, ' . $name . ', is invalid. Please only use latin characters a-z with an optional '
        . 'apostrophe or period. Your name is also limited to 256 characters.';
    echo json_encode($result_data);
    die();
}

// Check email
if (!preg_match('/^[\w\W]+@[\w\W\d]{1,256}$/', $email)) {
    $result_data->data = 'Your email, ' . $email . ', is invalid. Please use an email in the following format: <>@<>. '
        . 'Your email is also limited to 256 characters.';
    echo json_encode($result_data);
    die();
}

// Check year
if (!preg_match('/^\d{4}$/', $year)) {
    $result_data->data = 'Your year, ' . $year . ', is invalid. Please choose a valid year. ';
    echo json_encode($result_data);
    die();
}

// Check major
$sql = "SELECT name FROM resume_review_majors";

$result = $mysqli->query($sql);
$majors = [];

if ($result) {
	while ($row = $result->fetch_assoc()) {
		$majors[] = $row['name'];
    }
    $result->close();
} else {
    $result_data->data = 'Error occurred while fetching majors to validate. Please try again. '
        . 'If the error persists, contact the email on the bottom.';
    echo json_encode($result_data);
    die();
}

if (!in_array($major, $majors)) {
    $result_data->data = 'Your major, ' . $major . ', is invalid. Please choose a valid major. ';
    echo json_encode($result_data);
    die();
}

// Check if student has registered already
$sql = "SELECT company_id, email FROM resume_review_students WHERE email='" . $email . "'";
$result = $mysqli->query($sql);

if ($result) {
    if ($result->num_rows >= $student_review_max) {
        $result_data->data = 'You may not sign up for more than ' . $student_review_max . ' employer(s).';
        echo json_encode($result_data);
        die();
    }

    while ($row = $result->fetch_assoc()) {
		if ($row['company_id'] == $company_id) {
            $result_data->data = 'You tried to sign up for the same employer twice, however, you are limited to sign up for ' . $student_review_max . ' different employer(s).';
            echo json_encode($result_data);
            die();
        }
    }
    
    $result->close();
} else {
    $result_data->data = 'Error occurred while sending your reservation. Please try again. '
        . 'If the error persists, contact the email on the bottom.';
    echo json_encode($result_data);
    die();
}

$unique_filename = '';

if ($resume) {
    // Make resume dir
    if (!is_dir(RESUME_FILE_DIR)) {
        mkdir(RESUME_FILE_DIR, 0775, true);
    }

    // Generate unique filename
    $unique_filename = tempnam(RESUME_FILE_DIR, '');
    unlink($unique_filename);
    $unique_filename .= '.pdf';
}

// Update student table
$sql = "INSERT IGNORE INTO resume_review_students (name, company_id, email, time, year, major, resume)
    VALUES ('".$name."','".$company_id."','".$email."','".$time."','".$year."','".$major."','".$unique_filename."')";

$result = $mysqli->query($sql);
$num_of_affected_rows = $mysqli->affected_rows;

if (!$result) {
    $result_data->data = 'Error occurred while sending your reservation. Please try again. '
        . 'If the error persists, contact the email on the bottom.';
    echo json_encode($result_data);
    die();
}

if ($num_of_affected_rows === 0) {
    $result_data->data = 'Your selected timeslot is no longer available. Please select a new timeslot and try again.';
    echo json_encode($result_data);
    die();
}

if ($resume) {
    // Add file to server
    if (!move_uploaded_file($resume['tmp_name'], $unique_filename)) {

        $result_data->data = 'Resume file upload error. Try registering again. If the problem persists, select a different resume file.';
        echo json_encode($result_data);
        die();
    };
}

// Email user
$email_subject = "University of Cincinnati Technical Resume Review Day Registration Confirmation";

$email_msg = "Hello " . $name . ", \n \n";
$email_msg .= "Thank you for creating a registration for the University of Cincinnati Technical Resume Review Day. ";
$email_msg .= "The event will take place on " . date("l, F jS, Y", strtotime($event_date)) . " in " . $event_location . ". The dress attire is business casual. ";
$email_msg .= "Please come to the lobby 5 minutes before your scheduled time to sign in and CEAS Tribunal representatives while guide you from there. Most importantly, you are required to bring a copy of your resume to the event. \n \n";
$email_msg .= "During your resume review, you are scheduled to meet with representative " . $rep_name . " from " . $company . " at " . date("g:i a", strtotime($time)) . ". \n \n";
$email_msg .= "If you would like to make any changes to the information you have submitted, please reply to this email. Alternatively, you can email " . $admin_email . ". \n \n";
$email_msg .= "We look forward to seeing you at the event! \n \n";
$email_msg .= "Thank you, \n";
$email_msg .= "CEAS Tribunal";

$email_headers = "From: " . $admin_email;

if (mail($email, $email_subject, $email_msg, $email_headers)) {
    $result_data->status = 'success';
    echo json_encode($result_data);
} else {
    $result_data->data = 'Error occurred while sending the confirmation email. Please contact the email in the description notifying of this error. Do not resumbit the form.';
    echo json_encode($result_data);
}

mysqli_close($mysqli);
?>