CREATE TABLE [dbo].[person_relationship] (
    [id]                INT              IDENTITY (1, 1) NOT NULL,
    [person_id]         INT              NOT NULL,
    [person2_id]        INT              NOT NULL,
    [relationship_type] INT              NOT NULL,
    [identifier]        UNIQUEIDENTIFIER DEFAULT (newid()) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_person_relationship_person1] FOREIGN KEY ([person_id]) REFERENCES [dbo].[person] ([id]),
    CONSTRAINT [fk_person_relationship_person2] FOREIGN KEY ([person2_id]) REFERENCES [dbo].[person] ([id])
);



