<?php
error_reporting(-1);

set_include_path('./includes/');
require_once('mysqli.php');

// Initialize SQL result storage
if (!isset($result_data))
    $result_data = new stdClass();
$result_data->status = 'error';
$result_data->data = new stdClass();;

$result_data->data->event_date = "";
$result_data->data->event_start_time = "";
$result_data->data->event_end_time = "";
$result_data->data->event_lunch_start_time = "";
$result_data->data->event_lunch_end_time = "";
$result_data->data->review_interval_minutes = "";
$result_data->data->admin_email = "";
$result_data->data->employers_deadline = "";
$result_data->data->students_deadline = "";
$result_data->data->employers_open = "";
$result_data->data->students_open = "";

$sql = 'SELECT id, event_date, event_start_time, event_end_time, event_lunch_start_time, 
        event_lunch_end_time, review_interval_minutes, admin_email, employers_deadline, students_deadline, 
        employers_open, students_open FROM resume_review_info ORDER BY id DESC LIMIT 1';

$result = $mysqli->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $result_data->data->event_date = date("F jS, Y", strtotime($row['event_date']));
        $result_data->data->event_start_time = $row['event_start_time'];
        $result_data->data->event_end_time = $row['event_end_time'];
        $result_data->data->event_lunch_start_time = $row['event_lunch_start_time'];
        $result_data->data->event_lunch_end_time = $row['event_lunch_end_time'];
        $result_data->data->review_interval_minutes = $row['review_interval_minutes'];
        $result_data->data->admin_email = $row['admin_email'];
        $result_data->data->employers_deadline = date("F jS, Y", strtotime($row['employers_deadline']));
        $result_data->data->students_deadline = date("F jS, Y", strtotime($row['students_deadline']));
        $result_data->data->employers_open = $row['employers_open'];
        $result_data->data->students_open = $row['students_open'];
    }
    $result_data->status = 'success';
    $result->close();
}

echo json_encode($result_data);

mysqli_close($mysqli);
?>