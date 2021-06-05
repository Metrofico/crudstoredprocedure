CREATE PROC SP_Actualizar_Imagen @Id int,
                                 @Nombre varchar(255) = NULL,
                                 @Titulo varchar(255) = NULL,
                                 @Estado char(1) = NULL,
                                 @Imagen varchar(MAX)= NULL,
                                 @Callback varchar(100) OUTPUT
AS
begin
    SET NOCOUNT ON
    IF EXISTS(SELECT * FROM images WHERE id = @Id)
        begin
            if (@Imagen is null)
                begin
                    UPDATE images
                    SET nombre          = @Nombre,
                        titulo_primario = @Titulo,
                        estado          = @Estado
                    WHERE id = @Id
                    set @Callback = 'updated'
                end
            else
                begin
                    UPDATE images
                    SET nombre          = @Nombre,
                        titulo_primario = @Titulo,
                        img             = @Imagen,
                        estado          = @Estado
                    WHERE id = @Id
                    set @Callback = 'updated'
                end
        end
    ELSE
        set @Callback = 'not exist'
end