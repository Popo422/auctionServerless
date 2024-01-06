import { transpileSchema } from "@middy/validator/transpile";
export const schema = transpileSchema({
  type: "object",
  properties: {
    body: {
      type: "object",
      properties: {
        title: {
          type: "string",
        },
      },
      required: ["title"],
    },
  },
  required: ["body"],
});
