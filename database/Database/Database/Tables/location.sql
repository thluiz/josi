CREATE TABLE [dbo].[location] (
    [id]          INT            IDENTITY (1, 1) NOT NULL,
    [name]        VARCHAR (100)  NULL,
    [description] NVARCHAR (MAX) NULL,
    [active]      BIT            DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

