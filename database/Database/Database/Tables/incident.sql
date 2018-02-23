CREATE TABLE [dbo].[incident] (
    [id]                 INT             IDENTITY (1, 1) NOT NULL,
    [responsible_id]     INT             NOT NULL,
    [created_on]         DATETIME        DEFAULT (getdate()) NOT NULL,
    [incident_type]      INT             NOT NULL,
    [date]               DATETIME        NOT NULL,
    [closed]             BIT             DEFAULT ((0)) NOT NULL,
    [closed_on]          DATETIME        NULL,
    [closed_by]          INT             NULL,
    [treated]            BIT             DEFAULT ((0)) NOT NULL,
    [branch_id]          INT             NOT NULL,
    [description]        VARCHAR (MAX)   NULL,
    [fund_value]         DECIMAL (12, 2) DEFAULT ((0)) NULL,
    [value]              DECIMAL (12, 2) NULL,
    [scheduled]          BIT             DEFAULT ((0)) NOT NULL,
    [close_text]         VARCHAR (MAX)   NULL,
    [cancelled]          BIT             DEFAULT ((0)) NOT NULL,
    [cancelled_on]       DATETIME        NULL,
    [person_schedule_id] INT             NULL,
    [cancelled_by]       INT             NULL,
    [started_on]         DATETIME        NULL,
    [started_by]         INT             NULL,
    [updated_at]         DATETIME        DEFAULT (getdate()) NOT NULL,
    [comment_count]      INT             DEFAULT ((0)) NOT NULL,
    [card_id]            INT             NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_incident_branch] FOREIGN KEY ([branch_id]) REFERENCES [dbo].[branch] ([id]),
    CONSTRAINT [fk_incident_card] FOREIGN KEY ([card_id]) REFERENCES [dbo].[card] ([id]),
    CONSTRAINT [FK_incident_responsible] FOREIGN KEY ([responsible_id]) REFERENCES [dbo].[person] ([id])
);


GO
CREATE NONCLUSTERED INDEX [idx_cancelled_incident]
    ON [dbo].[incident]([cancelled] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_incident_status]
    ON [dbo].[incident]([incident_type] ASC, [closed] ASC, [treated] ASC, [cancelled] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_incident_cancelled_incident]
    ON [dbo].[incident]([incident_type] ASC, [cancelled] ASC, [date] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_incidents_missing]
    ON [dbo].[incident]([incident_type] ASC, [closed] ASC, [treated] ASC, [cancelled] ASC, [date] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_incident_date]
    ON [dbo].[incident]([date] ASC);


GO
CREATE NONCLUSTERED INDEX [idx_incident_updated_at]
    ON [dbo].[incident]([updated_at] ASC);

