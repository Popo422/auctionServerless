import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, ScanCommand } from "@aws-sdk/lib-dynamodb";
import createHttpError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware";

const getAuctions = async (event) => {
  try {
    let auctions;
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const scanCommand = new ScanCommand({
      TableName: process.env.AUCTIONS_TABLE,
    });
    const response = await docClient.send(scanCommand);
    auctions = response?.Items;
    return {
      statusCode: 200,
      body: JSON.stringify(auctions),
    };
  } catch (e) {
    console.error(e);
    throw new createHttpError.InternalServerError(e);
  }
};

export const handler = commonMiddleware(getAuctions)
