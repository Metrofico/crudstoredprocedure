window.addEventListener("load", function () {
    let updateImage = undefined;
    fetchAllImages(null);
    document.querySelector("#buscarImagen").addEventListener("click", function () {
        let input = document.querySelector("#buscarImgInput");
        let text = null
        if (input.value.trim() !== "") {
            text = input.value;
        }
        fetchAllImages(text);
    });
    document.querySelector("#subir").addEventListener('click', function (e) {
        let subirBtn = document.querySelector("#subir");
        let elementFile = document.querySelector("#fileImage");
        let nombre = document.querySelector("#nombreInput");
        let titulo = document.querySelector("#tituloInput");
        let status = document.querySelector("#statusInput");
        let statusBool = status.checked ? "1" : "0";
        if (nombre.value.trim() === "") {
            alert("Debes ingresar el Nombre de la imagen");
            return;
        }
        if (titulo.value.trim() === "") {
            alert("Debes ingresar el Titulo de la imagen");
            return;
        }
        let fileImageSelected = null;
        let filesElement = elementFile.files;
        if (filesElement.length === 0) {
            if (!updateImage) { // si esta undefined el update image entonces es obligatorio subir una imagen
                alert("No has seleccionado ninguna imagen");
                return;
            }
        }
        if (filesElement.length === 1) {
            fileImageSelected = filesElement[0];
        }
        if (fileImageSelected) {
            //Validar desde el frontend y no olvidar válidar tambien en el backend
            let allowedFiles = ["image/jpeg", "image/png", "image/jp2"];
            let allowedSizeInMb = 3 * (1024 * 1024);
            if (allowedFiles.indexOf(fileImageSelected.type) === -1) {// no se encuentra en el indice retornará -1
                alert("El archivo no es del formato correcto");
                elementFile.value = "";
                return;
            }
            if (fileImageSelected.size > allowedSizeInMb) {
                alert("El tamaño máximo de la imagen es de 3MB");
                elementFile.value = "";
                return;
            }
        }
        let confirm = window.confirm(!updateImage ? "¿Estás seguro de querer subir esta imagen?" : "¿Estás seguro de querer actualizar estos datos?");
        if (confirm) {
            startUploadFile(updateImage, fileImageSelected, nombre.value, titulo.value, statusBool, subirBtn, true);
        }

    });

    function clearInputs() {
        let subirBtn = document.querySelector("#subir");
        let elementFile = document.querySelector("#fileImage");
        let nombre = document.querySelector("#nombreInput");
        let titulo = document.querySelector("#tituloInput");
        let status = document.querySelector("#statusInput");
        subirBtn.innerText = "Empezar a subir imagen";
        subirBtn.disabled = false;
        elementFile.value = '';
        nombre.value = '';
        titulo.value = '';
        status.checked = false;
        updateImage = undefined;
    }

    function startUploadFile(id, fileSelected, nombre, titulo, status, btnStartUpload, reloadAll) {
        btnStartUpload.disabled = true;
        let URL_UPLOAD = "http://localhost/crudstoredprocedure/api/uploading_image.php";
        let dataFile = new FormData();
        dataFile.append("file", fileSelected);
        if (id) {
            dataFile.append("id", id);
        }
        dataFile.append("nombre", nombre);
        dataFile.append("titulo", titulo);
        dataFile.append("status", status)
        let request = new XMLHttpRequest();
        request.upload.addEventListener('progress', function (e) {
            let porcentaje = (e.loaded / e.total) * 100;
            btnStartUpload.innerText = porcentaje + "%";
        });
        request.addEventListener("error", function (e) {
            clearInputs();
            alert("Se ha interrumpido la subida de imagen, intenta nuevamente");
            if (reloadAll) {
                fetchAllImages(null);
            }
        });
        request.addEventListener("load", function (e) {
            clearInputs();
            if (reloadAll) {
                fetchAllImages(null);
            }
        });
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 0
                || request.readyState === 4 && request.status === 404) {
                alert("No se ha podido conectar con el servidor: " + request.statusText + " [ " + request.status + "]");
            }
            if (request.readyState === XMLHttpRequest.DONE) {
                console.log(request.responseText);
            }
        };
        request.open("POST", URL_UPLOAD);
        request.send(dataFile);
    }

    function createAllImagesDiv(json) {
        let imagenes = JSON.parse(json);
        let containerImages = document.querySelector("#view-all-section");
        containerImages.innerHTML = "";
        for (let i = 0; i < imagenes.length; i++) {
            let imagen = imagenes[i];
            let id = imagen["id"];
            let name = imagen["nombre"];
            let titulo = imagen["titulo_primario"];
            let status = imagen["estado"];
            let img = imagen["img"];
            divImage(id, name, titulo, img, status)
            console.log("Nombre " + imagen["titulo_primario"]);
        }
        let elementEditar = document.getElementsByClassName("editar");
        for (let i = 0; i < elementEditar.length; i++) {
            let element = elementEditar[i];
            element.addEventListener('click', function (e) {
                let element = e.target;
                let idValue = element.getAttribute("data-id");
                let nombreValue = element.getAttribute("data-nombre");
                let tituloValue = element.getAttribute("data-titulo");
                let statusValue = element.getAttribute("data-status");
                let btnStartUpload = document.querySelector("#subir");
                btnStartUpload.innerText = "Actualizar Imagen";
                btnStartUpload.disabled = false;
                let nombre = document.querySelector("#nombreInput");
                let titulo = document.querySelector("#tituloInput");
                let status = document.querySelector("#statusInput");
                nombre.value = nombreValue;
                titulo.value = tituloValue;
                status.checked = statusValue == 1;
                //Permitira hacer un cambio de datos
                updateImage = idValue;
            }, false);
        }
        let elementEliminar = document.getElementsByClassName("eliminar");
        for (let i = 0; i < elementEliminar.length; i++) {
            let element = elementEliminar[i];
            element.addEventListener('click', function (e) {
                let element = e.target;
                let idValue = element.getAttribute("data-id");
                let conf = window.confirm("¿Realmente deseas eliminar la imagen?");
                if (conf) {
                    removeImage(idValue)
                }
            }, false);
        }
    }

    function divImage(id, nombre, titulo, base64, status) {
        let containerImages = document.querySelector("#view-all-section");
        let divImage = "";
        divImage += "<div>";
        divImage += "<div>";
        divImage += "Nombre: " + nombre + "<br>";
        divImage += "Titulo:" + titulo + "<br>";
        divImage += "Estado: " + (status === 1 ? "Activo" : "Desabilitado") + "<br>";
        divImage += "<button class='editar' data-id='" + id + "' data-nombre='" + nombre + "' data-titulo='" + titulo + "' data-status='" + status + "'>Editar</button>";
        divImage += "<button class='eliminar' data-id='" + id + "'>Eliminar</button>";
        divImage += "</div>";
        divImage += "<image src='data:image/png;base64," + base64 + "' ></image>";
        divImage += "</div>";
        containerImages.innerHTML += (divImage);
    }

    function removeImage(id) {
        let URL_UPLOAD = "http://localhost/crudstoredprocedure/api/basic_operations.php";
        let dataFile = new FormData();
        let request = new XMLHttpRequest();
        dataFile.append("request", "delete");
        dataFile.append("id", id);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 0
                || request.readyState === 4 && request.status === 404) {
                alert("No se ha podido conectar con el servidor: " + request.statusText + " [ " + request.status + "]");
            }
            if (request.readyState === XMLHttpRequest.DONE) {
                console.log(request.responseText);
                fetchAllImages(null);
            }
        };
        request.open("POST", URL_UPLOAD);
        request.send(dataFile);
    }

    function fetchAllImages(text) {
        let URL_UPLOAD = "http://localhost/crudstoredprocedure/api/basic_operations.php";
        let dataFile = new FormData();
        let request = new XMLHttpRequest();
        dataFile.append("request", "fetchAll");
        dataFile.append("text", text);
        request.onreadystatechange = function () {
            if (request.readyState === 4 && request.status === 0
                || request.readyState === 4 && request.status === 404) {
                alert("No se ha podido conectar con el servidor: " + request.statusText + " [ " + request.status + "]");
            }
            if (request.readyState === XMLHttpRequest.DONE) {
                console.log("listo");
                createAllImagesDiv(request.responseText);
            }
        };
        request.open("POST", URL_UPLOAD);
        request.send(dataFile);
    }
});