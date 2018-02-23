CREATE TABLE [dbo].[card_commentary] (
    [id]         INT            IDENTITY (1, 1) NOT NULL,
    [card_id]    INT            NOT NULL,
    [commentary] NVARCHAR (MAX) NULL,
    [created_on] DATETIME       DEFAULT (getdate()) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

