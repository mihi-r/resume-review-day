<?php
error_reporting(-1);

set_include_path('./includes/');
require_once('mysqli.php');

$sql = "SELECT name FROM resume_review_majors";

$result = $mysqli->query($sql);

$majors = array();

while ($row = $result->fetch_assoc()) {
	$majors[] = $row['name'];
}

echo json_encode($majors);

$result->close();
mysqli_close($mysqli);
exit();
?>


