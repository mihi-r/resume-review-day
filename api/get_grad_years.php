<?php
error_reporting(-1);

set_include_path('./includes/');

// Initialize result storage
if (!isset($result_data)) 
    $result_data = new stdClass();
$result_data->status = 'success';
$result_data->data = [];

$year = date('Y');
$year_count = 10;

for ($i = 0; $i < $year_count; $i++) {
    $result_data->data[] = (string)$year;
    $year += 1;
}

echo json_encode($result_data);

exit();
?>


