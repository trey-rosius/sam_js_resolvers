import { test, expect, describe } from "vitest";
const AWS = require("aws-sdk");
/*
AWS.config.update({
  accessIdKey: process.env.ACCESS_KEY_AWS,
  secretAccessKey: process.env.SECRET_KEY_AWS,
  region: "us-east-2",
});
*/
const fs = require("fs");
const client = new AWS.AppSync({ region: "us-east-2" });
const runtime = { name: "APPSYNC_JS", runtimeVersion: "1.0.0" };

describe("sanity checks", () => {
  test("request correctly formated inputs", async () => {
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
    console.log("result is ", result);

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
