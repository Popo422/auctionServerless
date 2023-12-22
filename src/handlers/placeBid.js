import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import createHttpError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware.js";
const placeBid = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const params = {
      TableName: process.env.AUCTIONS_TABLE,
      Key: { id },
      UpdateExpression: "set highestBid.amount = :amount",
      ExpressionAttributeValues: { ":amount ": amount },
      ReturnValues: "ALL_NEW",
    };
    let updatedAuction;
    const queryCommand = new UpdateCommand(params);
    const response = await docClient.send(queryCommand);
    auction = response.Attributes;
    if (!auction) {
      throw new createHttpError.NotFound(`Auction with ID ${id} is not found!`);
    }
    return {
      statusCode: 200,
      body: JSON.stringify(updatedAuction),
    };
  } catch (e) {
    console.error(e);
    throw new createHttpError.InternalServerError(e);
  }
};

export const handler = commonMiddleware(placeBid);
