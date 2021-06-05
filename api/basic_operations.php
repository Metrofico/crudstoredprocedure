<?php
if ($_SERVER['REQUEST_METHOD'] != 'POST') {
    die();
}
global $base_de_datos, $arrayResult;
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
include_once "../database/create_data.php";
$databaseOperation = new DatabaseOperation();
if (isset($_POST["request"])) {
    $request = $_POST["request"];
    if ($request == "fetchAll") {
        $text = $_POST["text"];
        if ($text == "null") {
            $text = null;
        }
        echo json_encode($databaseOperation->getAll($text), JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
    }
    if ($request == "delete") {
        $id = $_POST["id"];
        echo json_encode($databaseOperation->delete($id), JSON_UNESCAPED_UNICODE | JSON_NUMERIC_CHECK);
    }
    die();
}
