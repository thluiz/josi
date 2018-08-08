
CREATE VIEW vw_ErrLst24Hrs
AS
SELECT TOP 100 PERCENT dbName, objectName, indexName, partitionNumber, NULL AS statsName, dateTimeStart, dateTimeEnd, sqlStatement, errorMessage		
FROM dbo.tbl_AdaptiveIndexDefrag_log
WHERE errorMessage IS NOT NULL AND dateTimeStart >= DATEADD(hh, -24, GETDATE())
UNION ALL
SELECT TOP 100 PERCENT dbName, objectName, NULL AS indexName, partitionNumber, statsName, dateTimeStart, dateTimeEnd, sqlStatement, errorMessage		
FROM dbo.tbl_AdaptiveIndexDefrag_Stats_log
WHERE errorMessage IS NOT NULL AND dateTimeStart >= DATEADD(hh, -24, GETDATE())
ORDER BY dateTimeStart;