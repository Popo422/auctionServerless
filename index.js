import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";
import middy from "@middy/core";
import httpEventNormalizer from "@middy/http-event-normalizer";
import httpJsonBodyParser from "@middy/http-json-body-parser";
import httpErrorHandler from "@middy/http-error-handler";
import createHttpError from "http-errors";
const createAuction = async (event) => {
  try {
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const { title } = event.body;
    const id = crypto.randomUUID();
    const now = new Date();
    const auction = {
      id,
      title,
      status: "OPEN",
      createdAt: now.toISOString(),
    };
    const putCommand = new PutCommand({
      TableName: process.env.AUCTIONS_TABLE,
      Item: auction,
    });
    const response = await docClient.send(putCommand);

    return {
      statusCode: 201,
      body: JSON.stringify(auction),
      response,
    };
  } catch (e) {
    console.error(e);
    throw new createHttpError.InternalServerError(e);
  }
};

export const handler = middy(createAuction).use(httpJsonBodyParser()).use(httpEventNormalizer()).use(httpErrorHandler());
