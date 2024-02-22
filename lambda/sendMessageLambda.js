import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log(" we are in here");

  let tableName = process.env.TABLE_NAME;

  console.log(`table name is ${tableName}`);
  const ksuidFromDate = (Math.random() + 1).toString(36).substring(2);
  const date = Date.now();
  console.log("Received event is {}", JSON.stringify(event, 3));
  const key = {
    PK: `MESSAGE#${ksuidFromDate}`,
    SK: `MESSAGE#${ksuidFromDate}`,
  };

  const messageItem = {
    ...event.arguments.input,
    PK: `MESSAGE#${ksuidFromDate}`,
    SK: `MESSAGE#${ksuidFromDate}`,
    GSI4PK: `USER#${event.arguments.input.senderId}`,
    GSI4SK: `MESSAGE#${ksuidFromDate}`,
    id: ksuidFromDate,
    createdOn: date,
  };

  console.log(`post item input ${postItem}`);

  const command = new PutCommand({
    TableName: tableName,
    Key: key,
    Item: messageItem,
  });

  const response = await docClient.send(command);

  console.log(response);
  return messageItem;
};
