import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, QueryCommand } from "@aws-sdk/lib-dynamodb";
import createHttpError from "http-errors";
import commonMiddleware from "../lib/commonMiddleware.js";
import validator from "@middy/validator";
import { schema } from "../lib/schemas/getAuctionSchema.js";
const getAuctions = async (event) => {
  try {
    console.log(event);
    let auctions;
    // const { status = "OPEN" } = event.queryStringParameters;
    let { status } = event.queryStringParameters;
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);

    const params = {
      TableName: process.env.AUCTIONS_TABLE,
      IndexName: "statusEndDate",
      KeyConditionExpression: "#status = :status ", //status is a reserved word kaya gumamit ako expressionAttributeValues
      ExpressionAttributeValues: {
        ":status": status,
      },
      ExpressionAttributeNames: {
        "#status": "status",
      },
    };
    // const scanCommand = new ScanCommand({
    //   TableName: process.env.AUCTIONS_TABLE,
    // });
    const queryCommand = new QueryCommand(params);
    const response = await docClient.send(queryCommand);
    auctions = response?.Items;
    console.log(auctions);
    return {
      statusCode: 200,
      body: JSON.stringify(auctions),
    };
  } catch (e) {
    console.error(e);
    throw new createHttpError.InternalServerError(e);
  }
};
export const handler = commonMiddleware(getAuctions).use(
  validator({
    eventSchema: schema,
    ajvOptions: {
      useDefaults: true,
      strict: false,
    },
  })
);
