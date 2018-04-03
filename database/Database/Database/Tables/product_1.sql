CREATE TABLE [dbo].[product] (
    [id]                        INT             IDENTITY (1, 1) NOT NULL,
    [name]                      VARCHAR (100)   NOT NULL,
    [country_id]                INT             NOT NULL,
    [base_value]                DECIMAL (12, 2) NOT NULL,
    [association_percentage]    DECIMAL (12, 2) NOT NULL,
    [im_percentage]             DECIMAL (12, 2) NOT NULL,
    [local_percentage]          DECIMAL (12, 2) NOT NULL,
    [association_minimal_value] DECIMAL (12, 2) NOT NULL,
    [im_minimal_value]          DECIMAL (12, 2) NOT NULL,
    [local_minimal_value]       DECIMAL (12, 2) NOT NULL,
    [category_id]               INT             NOT NULL,
    [archived]                  BIT             DEFAULT ((0)) NOT NULL,
    [domain_id]                 INT             NULL,
    [currency_id]               INT             DEFAULT ((1)) NOT NULL,
    PRIMARY KEY CLUSTERED ([id] ASC),
    CONSTRAINT [fk_product_category] FOREIGN KEY ([category_id]) REFERENCES [dbo].[product_category] ([id]),
    CONSTRAINT [fk_product_currency] FOREIGN KEY ([currency_id]) REFERENCES [dbo].[currency] ([id]),
    CONSTRAINT [fk_product_domain] FOREIGN KEY ([domain_id]) REFERENCES [dbo].[domain] ([id])
);

