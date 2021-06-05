<?php
# EStos datos son utilizados en POST_OPERATION_AGENDA.php

class DatabaseOperation
{
    public $base_de_datos;

    public function __construct()
    {
        $clave = "admin1234";
        $usuario = "root";
        $db = "metrotestdb";
        $server = "DESKTOP-R7OOBVA";
        try {
            $this->base_de_datos = new PDO("sqlsrv:Server=$server;Database=$db;", $usuario, $clave);
            $this->base_de_datos->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (Exception $e) {
            echo "Ocurrió un error con la base de datos: " . $e->getMessage();
        }
    }

    function insert($nombre, $titulo, $img64, $estado)
    {
        $sentencia = $this->base_de_datos->prepare("exec SP_Insertar_Imagen ?, ?, ?, ?, ?");
        $sentencia->bindParam(1, $nombre);
        $sentencia->bindParam(2, $titulo);
        $sentencia->bindParam(3, $estado);
        $sentencia->bindParam(4, $img64);
        $sentencia->bindParam(5, $Callback, PDO::PARAM_STR | PDO::PARAM_INPUT_OUTPUT, 100);
        if ($sentencia->execute()) {
            return $Callback;
        }
        return "undefined";
    }

    function update($id, $nombre, $titulo, $imagen, $estado)
    {
        $sentencia = $this->base_de_datos->prepare("exec SP_Actualizar_Imagen ?, ?, ?, ?, ?, ?");
        $sentencia->bindParam(1, $id);
        $sentencia->bindParam(2, $nombre);
        $sentencia->bindParam(3, $titulo);
        $sentencia->bindParam(4, $estado);
        $sentencia->bindParam(5, $imagen);
        $sentencia->bindParam(6, $Callback, PDO::PARAM_STR | PDO::PARAM_INPUT_OUTPUT, 100);
        if ($sentencia->execute()) {
            return $Callback;
        }
        return "undefined";
    }

    function delete($id)
    {
        $sentencia = $this->base_de_datos->prepare("exec SP_Eliminar_Imagen ?");
        $sentencia->bindParam(1, $id);
        if ($sentencia->execute()) {
            return "successful id " . $id;
        }
        return "error desconocido";
    }

    function getAll($text)
    {
        $sentencia = $this->base_de_datos->prepare("exec SP_Obtener_Imagenes ?");
        $sentencia->bindParam(1, $text);
        $arrayResult = array();
        if ($sentencia->execute()) {
            while ($usuario = $sentencia->fetchObject()) {
                $arrayResult[] = $usuario;
            }
        }
        return $arrayResult;
    }
}


