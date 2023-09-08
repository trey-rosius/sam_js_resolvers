import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from "uuid";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);

export const handler = async (event) => {
  console.log(" we are in here");
  const ksuidFromDate = (Math.random() + 1).toString(36).substring(2);
  const date = Date.now();
  console.log("Received event is {}", JSON.stringify(event, 3));
  const key = {
    PK: `USER#${event.arguments.postInput.userId}`,
    SK: `POST#${ksuidFromDate}`,
  };

  const postItem = {
    ...event.arguments.postInput,
    id: ksuidFromDate,
    createdOn: date,
  };

  console.log(`post item input ${postItem}`);
  /*
  const command = new PutCommand({
    TableName: "SocialMediaDynamoDBTable",
    Key: key,
    Item: postItem,
  });

  const response = await docClient.send(command);
  */
  console.log(response);
  return postItem;
};
