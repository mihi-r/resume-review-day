<?php
error_reporting(-1);

set_include_path('./includes/');
require_once('mysqli.php');

$name = "";
$company = "";
$email = "";
$phone = "";
$review_method = "";
$dietary = "";
$start_time = "";
$end_time = "";
$max_resumes = "";
$alumnus = "";
$majors = "";

$name = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['nameText'])));
$company = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['companyText'])));
$email = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['emailText'])));
$phone = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['phoneText'])));
$review_method = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['reviewMethodText'])));
$dietary = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['dietText'])));
$start_time = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['startTimeText'])));
$end_time = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['endTimeText'])));
$max_resumes = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['maxResumesText'])));
$alumnus = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['alumnusText'])));
$majors = mysqli_real_escape_string($mysqli, strip_tags(trim($_POST['majorsText'])));

// Initialize data validation and SQL result
if (!isset($result_data)) 
    $result_data = new stdClass();
$result_data->status = 'error';
$result_data->data = '';

// Get admin email, event date, and employer page open status
$admin_email = '';
$event_date = '';
$employers_open = null;

$sql = 'SELECT admin_email, event_date, employers_open FROM resume_review_info';
$result = $mysqli->query($sql);

if ($result) {
	while ($row = $result->fetch_assoc()) {
        $admin_email = $row['admin_email'];
        $event_date  = $row['event_date'];
        $employers_open = $row['employers_open'];
    }
    $result->close();
}

if ($admin_email === '' || $event_date === '' || $employers_open === null) {
    $result_data->data = 'Error occurred while retrieving admin information. Please try again. '
        . 'If the error persists, contact the email on the bottom.';
    echo json_encode($result_data);
    die();
}

// Get review method name for email
$review_method_name = '';

$sql = 'SELECT name FROM resume_review_methods WHERE id=' . $review_method;
$result = $mysqli->query($sql);

if ($result) {
	while ($row = $result->fetch_assoc()) {
        $review_method_name = $row['name'];
    }
    $result->close();
}

if ($review_method_name === '') {
    $result_data->data = 'Error occurred while retrieving review method information. Please try again. '
        . 'If the error persists, contact the email on the bottom.';
    echo json_encode($result_data);
    die();
}

if (!$employers_open) {
    $result_data->data = 'Employer registration is closed.';
    echo json_encode($result_data);
    die();
}

// Check name
if (!preg_match("/^[\w\ \'\.]{1,256}$/", $name)) {
    $result_data->data = 'Your name, ' . $name . ', is invalid. Please only use latin characters a-z with an optional '
        . 'apostrophe or period. Your name is also limited to 256 characters.';
    echo json_encode($result_data);
    die();
}

// Check company name
if (!preg_match("/^.{1,256}$/", $company)) {
    $result_data->data = 'The company name, ' . $company . ', is invalid. The company name is limited to 256 characters.';
    echo json_encode($result_data);
    die();
}

// Check email
if(!preg_match('/^[\w\W]+@[\w\W\d]{1,256}$/', $email)) {
    $result_data->data = 'Your email, ' . $email . ', is invalid. Please use an email in the following format: <>@<>. '
        . 'Your email is also limited to 256 characters.';
    echo json_encode($result_data);
    die();
}

// Check phone
if(!preg_match('/^[0-9]{3}-[0-9]{3}-[0-9]{4}$/', $phone)) {
    $result_data->data = 'Your phone number, ' . $phone . ', is invalid. Please format it in the following way: xxx-xxx-xxxx.';
    echo json_encode($result_data);
    die();
}

$sql ="INSERT INTO resume_review_employers (name, company, email, phone, review_method, diet, start, end, max_resumes, alumnus, majors)
    VALUES ('".$name."','".$company."','".$email."','".$phone."','".$review_method."','".$dietary."','".$start_time."','".$end_time."','".$max_resumes."','".$alumnus."','".$majors."')";
    
$result = $mysqli->query($sql);

if (!$result) {
    $result_data->data = 'Error occurred while sending your reservation. Please try again. '
    . 'If the error persists, contact the email on the bottom.';
    echo json_encode($result_data);
    die();
}

// Email user
$email_subject = "University of Cincinnati Technical Resume Review Day Registration Confirmation";

$email_msg = "Hello " . $name . ", \n \n";
$email_msg .= "Thank you for creating a registration for the University of Cincinnati Technical Resume Review Day. ";
$email_msg .= "The event will take place on " . date("l, F jS, Y", strtotime($event_date)) . ". ";
$email_msg .= "We will be reaching out to you shortly with an employer information packet and a folder of student resumes. \n \n";
$email_msg .= "Please confirm the information below is correct. \n \n";
$email_msg .= "Name: " . $name . "\n";
$email_msg .= "Company: " . $company . "\n";
$email_msg .= "Phone: " . $phone . "\n";
$email_msg .= "Review Method: " . $review_method_name . "\n";
if ($review_method === '1') {
    $email_msg .= "Dietary Restrictions: " . $dietary . "\n";
}
if ($review_method === '3') {
    $email_msg .= "Max resumes to review: " . $max_resumes . "\n";
} else {
    $email_msg .= "Start Time: " . date("g:i a", strtotime($start_time)) . "\n";
    $email_msg .= "End Time: " . date("g:i a", strtotime($end_time)) . "\n";
}
$email_msg .= "Alumnus: " . $alumnus . "\n";
$email_msg .= "Majors Interested: " . $majors . "\n \n";
$email_msg .= "If you would like to make any changes to the information you have submitted, please reply to this email. Alternatively, you can email " . $admin_email . ". \n \n";
$email_msg .= "We look forward to seeing you at the event! \n \n";
$email_msg .= "Thank you, \n";
$email_msg .= "CEAS Tribunal";

$email_headers = "From: " . $admin_email . "\r\n";
$email_headers .= "Cc: " . $admin_email . "\r\n";

if (mail($email, $email_subject, $email_msg, $email_headers)) {
    $result_data->status = 'success';
    echo json_encode($result_data);
} else {
    $result_data->data = 'Error occurred while sending the confirmation email. Please contact the email in the description notifying of this error. Do not resubmit the form.';
    echo json_encode($result_data);
}

mysqli_close($mysqli);
exit();
?>