CREATE TABLE [dbo].[card_commentary] (
    [id]             INT            IDENTITY (1, 1) NOT NULL,
    [card_id]        INT            NOT NULL,
    [commentary]     NVARCHAR (MAX) NULL,
    [created_on]     DATETIME       DEFAULT (getdate()) NOT NULL,
    [responsible_id] INT            NOT NULL,
    [archived]       BIT            DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);




GO
CREATE NONCLUSTERED INDEX [ix_card_commentary_card]
    ON [dbo].[card_commentary]([card_id] ASC);

