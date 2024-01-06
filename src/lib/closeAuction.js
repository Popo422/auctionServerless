import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, UpdateCommand } from "@aws-sdk/lib-dynamodb";

export const closeAuction = async (auction) => {
  try {
    const client = new DynamoDBClient({});
    const docClient = DynamoDBDocumentClient.from(client);
    const params = {
      TableName: process.env.AUCTIONS_TABLE,
      Key: { id: auction.id },
      UpdateExpression: "set #status = :status",
      ExpressionAttributeValues: { ":status": "CLOSE" },
      ExpressionAttributeNames: { "#status": "status" },
    };
    const updateCommand = new UpdateCommand(params);
    const response = await docClient.send(updateCommand);
    const updatedAuction = response.Attributes;

    return {
      statusCode: 200,
      body: JSON.stringify(updatedAuction),
    };
  } catch (e) {
    console.error(e);
    throw new createHttpError.InternalServerError(e);
  }
};
