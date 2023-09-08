import { util } from "@aws-appsync/utils";
import { put } from "@aws-appsync/utils/dynamodb";

export function request(ctx) {
  const { commentInput } = ctx.args;

  const key = {
    PK: `POST#${commentInput.postId}`,
    SK: `COMMENT#${util.autoKsuid()}`,
  };

  const commentItem = {
    ...commentInput,
    id: util.autoKsuid(),
    GSI3PK: "COMMENT#",
    GSI3SK: `COMMENT#${util.autoKsuid()}`,
    createdOn: util.time.nowEpochMilliSeconds(),
  };

  return put({ key: key, item: commentItem });
}

export function response(ctx) {
  return ctx.result;
}
