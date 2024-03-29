import { test, expect, describe } from "vitest";
const AWS = require("aws-sdk");

const fs = require("fs");
const client = new AWS.AppSync({ region: "us-east-2" });
const runtime = { name: "APPSYNC_JS", runtimeVersion: "1.0.0" };

describe("sanity checks", () => {
  test("request correctly formatted inputs", async () => {
    const code = fs.readFileSync(
      "./js_resolvers/formatUserAccountInput.js",
      "utf8"
    );
    const context = fs.readFileSync("./test/context.json", "utf8");
    const contextJSON = JSON.parse(context);

    const response = await client
      .evaluateCode({ code, context, runtime, function: "request" })
      .promise();

    const result = JSON.parse(response.evaluationResult);

    const condition = result.payload.condition.PK;

    console.log("condition is ", condition);

    expect(result.payload.key.PK).toBeDefined();
    expect(result.payload.key.SK).toBeDefined();

    expect(result.payload.values.email).toBeDefined();
    expect(result.payload.values.email).toEqual(
      contextJSON.arguments.userInput.email
    );
  });

  test("expect primary key condition to be falsy", async () => {
    const code = fs.readFileSync(
      "./js_resolvers/formatUserAccountInput.js",
      "utf8"
    );
    const context = fs.readFileSync("./test/context.json", "utf8");
    const contextJSON = JSON.parse(context);

    const response = await client
      .evaluateCode({ code, context, runtime, function: "request" })
      .promise();

    const result = JSON.parse(response.evaluationResult);

    expect(JSON.parse(result.payload.condition.PK.attributeExists)).toBeFalsy();
  });
});
