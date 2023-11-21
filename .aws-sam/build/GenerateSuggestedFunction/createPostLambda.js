import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";

import {
  BedrockRuntimeClient,
  InvokeModelCommand,
} from "@aws-sdk/client-bedrock-runtime";

const bedrockClient = new BedrockRuntimeClient();
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
    PK: `USER#${event.arguments.postInput.userId}`,
    SK: `POST#${ksuidFromDate}`,
  };

  const postItem = {
    ...event.arguments.postInput,
    PK: `USER#${event.arguments.postInput.userId}`,
    SK: `POST#${ksuidFromDate}`,
    GSI2PK: "POST#",
    GSI2SK: `POST#${ksuidFromDate}`,
    id: ksuidFromDate,
    createdOn: date,
  };

  console.log(`post item input ${postItem}`);

  const command = new PutCommand({
    TableName: tableName,
    Key: key,
    Item: postItem,
  });

  const response = await docClient.send(command);

  const PROMPT =
    "Can you write a story that is 5 paragraphs long about a cat in space. The story should be funny and have a begining, middle, and end. The story should be funny to a 10 year old.";

  const input = {
    body: `{"prompt":"${PROMPT}","maxTokens":2047,"temperature":0.7,"topP":1,"stopSequences":[],"countPenalty":{"scale":0},"presencePenalty":{"scale":0},"frequencyPenalty":{"scale":0}}`,
    contentType: "application/json",
    accept: "application/json",
    modelId: "ai21.j2-ultra-v1",
  };

  console.log("We are in here");
  console.log(`input is ${input}`);

  const commandModel = new InvokeModelCommand(input);

  let data, completions;

  try {
    data = await bedrockClient.send(commandModel);

    completions = JSON.parse(new TextDecoder().decode(data.body)).completions;

    const result = completions[0].data.text;
    console.log(` result is ${result}`);
  } catch (error) {
    console.error(error);
  }

  //return result;
  console.log(response);
  return postItem;
};
