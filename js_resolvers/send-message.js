import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const { input } = ctx.args;

  const id = util.autoKsuid();

  const key = {
    PK: `MESSAGE#${id}`,
    SK: `MESSAGE#${id}`,
  };

  const messageItem = {
    ...input,
    id: id,
    GSI4PK: `USER#${input.senderId}`,
    GSI4SK: `MESSAGE#${id}`,
    createdOn: util.time.nowEpochMilliSeconds(),
  };

  return put({ key: key, item: messageItem });
}

export function response(ctx) {
  return ctx.result;
}
