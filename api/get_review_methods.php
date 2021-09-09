<?php
error_reporting(-1);

set_include_path('./includes/');
require_once('mysqli.php');

// Initialize SQL result storage
if (!isset($result_data))
    $result_data = new stdClass();
$result_data->status = 'error';
$result_data->data = new stdClass();

$result_data->data = [];

$sql = 'SELECT id, name, description, active FROM resume_review_methods';

$result = $mysqli->query($sql);

if ($result) {
    while ($row = $result->fetch_assoc()) {
        $review_method = new stdClass();
        $review_method->id = $row['id'];
        $review_method->name = $row['name'];
        $review_method->description = $row['description'];
        $review_method->active = (int)$row['active'];

        $result_data->data[] = $review_method;
    }
    $result_data->status = 'success';
    $result->close();
}

echo json_encode($result_data);

mysqli_close($mysqli);
?>