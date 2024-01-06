import createHttpError from "http-errors";
import { getEndedAuctions } from "../lib/getEndedAuctions.js";
import { closeAuction } from "../lib/closeAuction.js";

const processAuctions = async (event, context) => {
  try {
    const auctionsToClose = await getEndedAuctions();
    const closePromises = auctionsToClose.map((auction) => closeAuction(auction));
    await Promise.all(closePromises);
    return { closed: closePromises.length };
  } catch (e) {
    console.error(e);
    throw new createHttpError.InternalServerError(e);
  }
};

export const handler = processAuctions;
