import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import createHttpError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";
const getAuction = async (event) => {
  try {
    let auction;
    const { id } = event.pathParameters;
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const queryCommand = new QueryCommand({
      TableName: process.env.AUCTIONS_TABLE,
      KeyConditionExpression: "id = :Id",
      ExpressionAttributeValues: {
        ":Id": id,
      },
    });
    const response = await docClient.send(queryCommand);
    auction = response.Items[0];
    if (!auction) {
      throw new createHttpError.NotFound(`Auction with ID ${id} is not found!`);
    }
    return {
      statusCode: 200,
      body: JSON.stringify(auction),
    };
  } catch (e) {
    console.error(e);
    throw new createHttpError.InternalServerError(e);
  }
};

export const handler = commonMiddleware(getAuction);
