import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import createHttpError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware.js";
export const getAuctionById = async (id) => {
  let auction;
  const client = new DynamoDBClient({});
  const docClient = DynamoDBDocumentClient.from(client);
  try {
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
    return auction;
  } catch (e) {
    console.error(e);
    throw new createHttpError.InternalServerError(e);
  }
};

const getAuction = async (event) => {
  try {
    const { id } = event.pathParameters;
    const auction = await getAuctionById(id);
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
