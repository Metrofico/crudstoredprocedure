CREATE PROC SP_Obtener_Imagenes @Filtrar varchar(255) = NULL
AS IF (@Filtrar IS NULL)
    SELECT *
    FROM images
ELSE
    begin
        SET @Filtrar = '%' + @Filtrar + '%';
        SELECT *
        FROM images
        WHERE nombre LIKE @Filtrar
           OR titulo_primario LIKE @Filtrar
           OR id LIKE @Filtrar
    end