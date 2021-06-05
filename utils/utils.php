<?php
function isEmptyStr($text)
{
    return !$text || empty(trim($text));
}

function createResponse($status, $message)
{
    echo json_encode(array(
        "status" => $status,
        "message" => $message
    ));
}

function getPostValueDefault($key, $default)
{
    return isset($_POST[$key]) ? $_POST[$key] : $default;
}

function getPostValue($key)
{
    return isset($_POST[$key]) ? $_POST[$key] : null;
}