const { DynamoDBClient, QueryCommand, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const { marshall, unmarshall } = require("@aws-sdk/util-dynamodb");
const crypto = require("crypto");