<?php
error_reporting(-1);

set_include_path('./includes/');
require_once('mysqli.php');

// Initialize SQL result storage
if (!isset($result_data))
    $result_data = new stdClass();
$result_data->status = 'error';
$result_data->data = [];

$sql = 'SELECT id, name, company, start, end, majors FROM resume_review_employers';

$result = $mysqli->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $employer_info = new stdClass();
        $employer_info->name = $row['name'];
        $employer_info->company = $row['company'];
        $employer_info->company_id = $row['id'];
        $employer_info->start = $row['start'];
        $employer_info->end = $row['end'];
        $employer_info->majors = explode(', ', $row['majors']);
        $employer_info->unavailable_times = [];

        $student_sql = 'SELECT time, company_id FROM resume_review_students WHERE company_id=' . $row['id'];
        $student_result = $mysqli->query($student_sql);

        // Check for times that are already reserved
        if ($student_result) {
            while ($student_row = $student_result->fetch_assoc()) {
                $employer_info->unavailable_times[] = $student_row['time'];
            }
            $student_result->close();
        } else {
            echo json_encode($result_data);
            die();
        }
        
        $result_data->data[] = $employer_info;
    }
    $result_data->status = 'success';
    $result->close();
}

echo json_encode($result_data);

mysqli_close($mysqli);
?>