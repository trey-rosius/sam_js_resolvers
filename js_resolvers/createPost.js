import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const { postInput } = ctx.args;

  const key = {
    PK: `USER#${postInput.userId}`,
    SK: `POST#${util.autoKsuid()}`,
  };

  const postItem = {
    ...postInput,
    id: util.autoKsuid(),
    GSI2PK: "POST#",
    GSI2SK: `POST#${util.autoKsuid()}`,
    createdOn: util.time.nowEpochMilliSeconds(),
  };

  return put({ key: key, item: postItem });
}

export function response(ctx) {
  return ctx.result;
}
