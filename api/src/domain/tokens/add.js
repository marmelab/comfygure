import { addDays } from "date-fns";
import { ValidationError } from "../errors";
import tokensQueries from "../../queries/tokens";
import generateRandomString from "./generateRandomString";

export default async (projectId, name, level, expiresInDays) => {
  const expiryDate = expiresInDays
    ? addDays(new Date(), expiresInDays + 1)
    : null;

  try {
    return await tokensQueries.insertOne({
      project_id: projectId,
      name,
      level,
      key: generateRandomString(40),
      expiry_date: expiryDate,
    });
  } catch (error) {
    if (error.message.includes("token_project_id_name_key")) {
      throw new ValidationError({
        message: `A token named "${name}" already exists for that project`,
        details: 'Type "comfy token list" to list available tokens.',
      });
    }

    throw error;
  }
};
