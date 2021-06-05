CREATE PROC SP_Eliminar_Imagen @Id int
AS
DELETE
FROM images
WHERE id = @Id