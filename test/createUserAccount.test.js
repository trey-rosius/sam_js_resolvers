import { test, expect } from "vitest";
const AWS = require("aws-sdk");
const fs = require("fs");
const client = new AWS.AppSync({ region: "us-east-2" });
const runtime = { name: "APPSYNC_JS", runtimeVersion: "1.0.0" };

test("request correctly formated inputs", async () => {
  const code = fs.readFileSync("./js_resolvers/createUserAccount.js", "utf8");
  const context = fs.readFileSync("./test/context.json", "utf8");
  const contextJSON = JSON.parse(context);

  const response = await client
    .evaluateCode({ code, context, runtime, function: "request" })
    .promise();
  console.log("reponse is ", response);

  const result = JSON.parse(response.evaluationResult);
  console.log("result is ", result);

  expect(result.key.PK.S).toBeDefined();
  expect(result.key.SK.S).toBeDefined();

  expect(result.attributeValues.firstName.S).toEqual(
    contextJSON.arguments.userInput.firstName
  );
});
