CREATE TABLE images
(
    id              int IDENTITY (1, 1) PRIMARY KEY,
    nombre          varchar(255),
    titulo_primario varchar(255),
    img             varbinary(MAX),
    estado          char(1)
)