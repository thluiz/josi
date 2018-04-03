CREATE TABLE [dbo].[branch] (
    [id]          INT           IDENTITY (1, 1) NOT NULL,
    [name]        VARCHAR (100) NULL,
    [active]      BIT           DEFAULT ((1)) NOT NULL,
    [abrev]       VARCHAR (100) NULL,
    [initials]    VARCHAR (3)   NULL,
    [location_id] INT           NOT NULL,
    [has_voucher] BIT           DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);



