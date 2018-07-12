﻿CREATE TABLE [dbo].[contact_method] (
    [id]     INT           IDENTITY (1, 1) NOT NULL,
    [order]  INT           DEFAULT ((0)) NOT NULL,
    [name]   VARCHAR (150) NOT NULL,
    [active] BIT           DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC)
);

