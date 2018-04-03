CREATE TABLE [dbo].[card] (
    [id]                      INT            IDENTITY (1, 1) NOT NULL,
    [title]                   NVARCHAR (250) NULL,
    [due_date]                DATETIME       NULL,
    [created_on]              DATETIME       DEFAULT (getdate()) NOT NULL,
    [feature_area_id]         INT            NOT NULL,
    [description]             NVARCHAR (MAX) NULL,
    [leader_id]               INT            NULL,
    [current_step_id]         INT            NULL,
    [card_template_id]        INT            NOT NULL,
    [parent_id]               INT            NULL,
    [closed]                  BIT            DEFAULT ((0)) NOT NULL,
    [cancelled]               BIT            DEFAULT ((0)) NOT NULL,
    [archived]                BIT            DEFAULT ((0)) NOT NULL,
    [last_action]             DATETIME       NULL,
    [location_id]             INT            NOT NULL,
    [blocked]                 BIT            DEFAULT ((0)) NOT NULL,
    [order]                   INT            DEFAULT ((0)) NOT NULL,
    [abrev]                   VARCHAR (15)   NULL,
    [started_on]              DATETIME       NULL,
    [closed_on]               DATETIME       NULL,
    [created_by]              INT            NULL,
    [has_overdue_card]        BIT            DEFAULT ((0)) NOT NULL,
    [automatically_generated] BIT            DEFAULT ((0)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);






GO
CREATE NONCLUSTERED INDEX [ix_card_parent]
    ON [dbo].[card]([parent_id] ASC);


GO
CREATE NONCLUSTERED INDEX [ix_card_has_overdue_card]
    ON [dbo].[card]([has_overdue_card] ASC)
    INCLUDE([due_date]);

