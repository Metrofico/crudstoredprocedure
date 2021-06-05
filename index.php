<!doctype html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>CRUD Images</title>
    <script src="js/main.js"></script>
</head>
<body>
<div class="container">
    <div class="upload-section">
        <label>
            <input id="nombreInput" type="text" placeholder="Nombre">
        </label>
        <label>
            <input id="tituloInput" type="text" placeholder="Título">
        </label>
        <label>
            <input id="statusInput" type="checkbox">
            Activar Imagen
        </label>
        <input type="file" accept="image/jpeg, image/png, image/jp2" id="fileImage">
    </div>
    <div>
        <button id="subir">Empezar a subir imagen</button>
    </div>
    <hr>
    <hr>
    <div>
        <label for="buscarImgInput"></label><input id="buscarImgInput" type="text" placeholder="Buscar una imagen">
        <button id="buscarImagen">Buscar</button>
    </div>
    <hr>
    <div id="view-all-section">
        <div class="image">

        </div>
    </div>
</div>
</body>
</html>