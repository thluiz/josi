CREATE TABLE [dbo].[person_relationship] (
    [id]                INT IDENTITY (1, 1) NOT NULL,
    [person_id]         INT NOT NULL,
    [person2_id]        INT NOT NULL,
    [relationship_type] INT NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

