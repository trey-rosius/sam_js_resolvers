import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { PutCommand, DynamoDBDocumentClient } from "@aws-sdk/lib-dynamodb";
const {
  BedrockRuntimeClient,
  InvokeModelCommand,
} = require("@aws-sdk/client-bedrock-runtime"); // ES Modules import

import { v4 as uuidv4 } from "uuid";
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const bedrockClient = new BedrockRuntimeClient();
export const handler = async (event) => {
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

  const command = new InvokeModelCommand(input);

  let data, completions;

  try {
    data = await client.send(command);

    completions = JSON.parse(new TextDecoder().decode(data.body)).completions;

    const result = completions[0].data.text;
    console.log(` result is ${result}`);
  } catch (error) {
    console.error(error);
  }

  return result;
};
