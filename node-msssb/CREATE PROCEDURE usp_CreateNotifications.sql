CREATE PROCEDURE usp_CreateNotifications (
  @ID INT
  ,@Name VARCHAR(30)
  ,@Message VARCHAR(255)
  )
AS
BEGIN
  --DECLARE @OrderDate AS SMALLDATETIME
  --SET @OrderDate = GETDATE()
  DECLARE @JSONMessage VARBINARY(MAX)
 
  CREATE TABLE #Message (
    ID INT PRIMARY KEY
    ,Name VARCHAR(30)
    ,Message VARCHAR(255)
    )
 
  INSERT INTO #Message (
    ID
    ,Name
    ,Message
    )
  VALUES (
    @ID
    ,@Name
    ,@Message
    )
 
  --Insert to Notifications Table
  INSERT INTO Notifications (
    ID
    ,Name
    ,Message
    )
  VALUES (
    @ID
    ,@Name
    ,@Message
    )
     --Creating the XML Message
  SELECT @JSONMessage = CONVERT(VARBINARY(max), (
      SELECT *
      FROM #Message
      FOR JSON PATH
        
      ), 0);
 
  DECLARE @Handle UNIQUEIDENTIFIER;
  --Sending the Message to the Queue
  BEGIN
    DIALOG CONVERSATION @Handle
    FROM SERVICE NotificationService TO SERVICE 'NotificationService' ON CONTRACT [postnotifications]
    WITH ENCRYPTION = OFF;
 
    SEND ON CONVERSATION @Handle MESSAGE TYPE ReceivedNotification(@JSONMessage);
  END 
  GO