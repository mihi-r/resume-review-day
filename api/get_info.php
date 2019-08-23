<?php
error_reporting(-1);
set_include_path('./includes/');
require_once('mysqli.php');

// Initialize SQL result storage
if (!isset($result_data)) 
    $result_data = new stdClass();
$result_data->status = 'error';
$result_data->data = [];

$sql = 'SELECT event_date, event_start_time, event_end_time,
        event_lunch_start_time, event_lunch_end_time, review_interval_minutes,
        admin_email FROM resume_review_info';

$result = $mysqli->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $result_data->data[] = $row;
    }
    $result_data->status = 'success';
}

echo json_encode($result_data);

mysqli_close($mysqli);
?>