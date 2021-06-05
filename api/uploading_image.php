<?php
include_once "../utils/utils.php";
include_once "../database/create_data.php";
header('Access-Control-Allow-Origin: *');
header('Content-type: application/json');
$allowedFiles = ['image/jpeg', 'image/png'];
$allowedSize = 3 * (1024 * 1024); //MB
$id = (int)getPostValueDefault("id", -1);
$isUpdating = $id > 0;
$nameInput = getPostValue("nombre");
$tituloInput = getPostValue("titulo");
$status = getPostValue("status");
if (isEmptyStr($nameInput)) {
    createResponse("error", "Debes especificar el nombre de la imagen");
    return;
}
if (isEmptyStr($tituloInput)) {
    createResponse("error", "Debes especificar el titulo de la imagen");
    return;
}

if (($status === 0 || $status === 1)) {
    createResponse("error", "Debes especificar el estado de la imagen [1 o 0]: " . $status);
    return;
}
$img64 = null;
if (isset($_FILES["file"])) {
    switch ($_FILES['file']['error']) {
        // tamaño excedido de php.ini
        case UPLOAD_ERR_INI_SIZE:
            createResponse("error", "Se ha excedido el tamaño establecido en PHP, cambialo desde php.ini");
            break;
        // No se encontró un archivo
        case UPLOAD_ERR_NO_FILE:
            createResponse("error", "No se ha enviado ninguna imagen desde el cliente");
            break;
        // No ha ocurrido ningun error
        case UPLOAD_ERR_OK:
            break;
        // otros errores generales
        default:
            createResponse("error", "No se ha podido subir la imagen, algo fue mal!");
            break;
    }
    $FILE_INFO = finfo_open();
    $dataFile = file_get_contents($_FILES['file']['tmp_name']);
    $file_type = finfo_buffer($FILE_INFO, $dataFile, FILEINFO_MIME_TYPE);
    if (!in_array($file_type, $allowedFiles)) {
        createResponse("error", "No es un tipo de archivo admitido");
        return;
    }
    $file_size = $_FILES['file']['size'];
    if ($file_size > $allowedSize) {
        createResponse("error", "El archivo es muy grande ha excedido el limite máximo de 3MB");
        return;
    }
    $img64 = base64_encode($dataFile);
}
//despues de haber realizado todo correctamente procedemos a almacenarlo
$databaseOperation = new DatabaseOperation();
if ($isUpdating) {
    $result = $databaseOperation->update($id, $nameInput, $tituloInput, $img64, $status);
} else {
    //REQUERIDO
    if (!$img64) {
        createResponse("error", "No se ha enviado ninguna imagen");
        return;
    }
    $result = $databaseOperation->insert($nameInput, $tituloInput, $img64, $status);
}

createResponse("successful", $result);
