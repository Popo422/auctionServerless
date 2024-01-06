import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";
import crypto from "crypto";
import createHttpError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware.js";
import validator from "@middy/validator";
import { schema } from "../lib/schemas/createSchemaAuction.js";
const createAuction = async (event) => {
  try {
    const { title } = event.body;
    const {email} = event.requestContext.authorizer.lambda
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
 
    const id = crypto.randomUUID();
    const now = new Date();
    const endDate = new Date();
    endDate.setHours(now.getHours() + 1);
    const auction = {
      id,
      title,
      status: "OPEN",
      createdAt: now.toISOString(),
      endingAt: endDate.toISOString(),
      highestBid: {
        amount: 0,
      },
      seller: email
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

export const handler = commonMiddleware(createAuction).use(
  validator({
    eventSchema: schema,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  })
);
