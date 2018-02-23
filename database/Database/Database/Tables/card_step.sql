CREATE TABLE [dbo].[card_step] (
    [id]               INT           IDENTITY (1, 1) NOT NULL,
    [name]             VARCHAR (150) NULL,
    [card_id]          INT           NOT NULL,
    [order]            INT           DEFAULT ((0)) NOT NULL,
    [need_due_date]    BIT           DEFAULT ((0)) NOT NULL,
    [need_action]      BIT           DEFAULT ((0)) NOT NULL,
    [is_blocking_step] BIT           DEFAULT ((0)) NOT NULL,
    [is_closing_step]  BIT           DEFAULT ((0)) NOT NULL,
    [archived]         BIT           DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_card_step_card] FOREIGN KEY ([card_id]) REFERENCES [dbo].[card] ([id])
);

