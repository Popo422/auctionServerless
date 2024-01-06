import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import createHttpError from "http-errors";
export const getEndedAuctions = async (id) => {
  const now = new Date();
  let auction;
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  const params = {
    TableName: process.env.AUCTIONS_TABLE,
    IndexName: "statusEndDate",
    KeyConditionExpression: "#status = :status AND endingAt <= :now", //status is a reserved word kaya gumamit ako expressionAttributeValues
    ExpressionAttributeValues: {
      ":status": 'OPEN',
      ":now": now.toISOString(),
    },
    ExpressionAttributeNames: {
      "#status": "status",
    },
  };
  try {
    const queryCommand = new QueryCommand(params);
    const response = await docClient.send(queryCommand);
    auction = response.Items;
    if (!auction) {
      throw new createHttpError.NotFound(`something went wrong`);
    }
    return auction;
  } catch (e) {
    console.error(e);
    throw new createHttpError.InternalServerError(e);
  }
};



