CREATE TABLE [dbo].[voucher] (
    [id]                  INT           IDENTITY (1, 1) NOT NULL,
    [title]               VARCHAR (300) NOT NULL,
    [url]                 VARCHAR (100) NOT NULL,
    [header_text]         VARCHAR (MAX) NULL,
    [initials]            VARCHAR (3)   NULL,
    [active]              BIT           DEFAULT ((1)) NOT NULL,
    [additional_question] VARCHAR (200) NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

