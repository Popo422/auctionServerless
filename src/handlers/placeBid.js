import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import createHttpError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware.js";
import { getAuctionById } from "./getAuction.js";
const placeBid = async (event) => {
  try {
    const { id } = event.pathParameters;
    const { amount } = event.body;
    const auction = await getAuctionById(id);
    if (amount <= auction.highestBid.amount) {
      throw new createHttpError.Forbidden(`Your bid must be higher than ${auction.highestBid.amount}!`);
    }
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const params = {
      TableName: process.env.AUCTIONS_TABLE,
      Key: { id },
      UpdateExpression: "set highestBid.amount = :amount",
      ExpressionAttributeValues: { ":amount": amount },
      ReturnValues: "ALL_NEW",
    };
    let updatedAuction;
    const updateCommand = new UpdateCommand(params);
    const response = await docClient.send(updateCommand);
    updatedAuction = response.Attributes;

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
