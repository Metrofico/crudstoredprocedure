CREATE PROC SP_Insertar_Imagen @Nombre varchar(255) = NULL,
                               @Titulo varchar(255) = NULL,
                               @Estado char(1) = NULL,
                               @Imagen varchar(MAX)= NULL,
                               @Callback varchar(100) OUTPUT
AS
begin
    SET NOCOUNT ON
    IF EXISTS(SELECT * FROM images WHERE nombre = @Nombre)
        begin
            set @Callback = 'already exists'
        end
    ELSE
        begin
            INSERT INTO images(nombre, titulo_primario, img, estado)
            VALUES (@Nombre, @Titulo, @Imagen, @Estado)
            set @Callback = 'inserted'
        end
end