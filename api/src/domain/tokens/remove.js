import tokensQueries from "../../queries/tokens";
import { ARCHIVED } from "../common/states";

export default async (tokenId) => {
  return tokensQueries.updateOne(tokenId, {
    state: ARCHIVED,
  });
};
