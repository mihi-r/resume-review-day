<?php
error_reporting(-1);

set_include_path('./includes/');
require_once('mysqli.php');

// Initialize SQL result storage
if (!isset($result_data)) 
    $result_data = new stdClass();
$result_data->status = 'error';
$result_data->data = [];

$sql = "SELECT name FROM resume_review_majors";

$result = $mysqli->query($sql);

$majors = array();

if ($result) {
	while ($row = $result->fetch_assoc()) {
		$result_data->data[] = $row['name'];
	}
	$result_data->status = 'success';
}

echo json_encode($result_data);

$result->close();
mysqli_close($mysqli);
exit();
?>


