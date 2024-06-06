import { Knex } from "knex";

export class GamesService {
  constructor(private knex: Knex) {}
  async getCompleteLanguage(userID: number) {
    return await this.knex
      .select("sign_language")
      .from("complete_learning_list")
      .leftJoin(
        "sign_languages",
        "complete_learning_list.sign_language_id",
        "sign_languages.id"
      )
      .where("user_id", userID);
  }

  async completeLanguage(userID: number, signLanguage: string) {
    console.log(`signLanguage: ${signLanguage}`);
    //get sign language ID based on sign language
    const signLanguageID = (
      await this.knex
        .select("id")
        .from("sign_languages")
        .where("sign_language", signLanguage)
    )[0]?.id;

    //search if the sign language id exist in the table for the particular user
    const completedList = await this.knex
      .select("id")
      .from("complete_learning_list")
      .where("user_id", userID)
      .andWhere("sign_language_id", signLanguageID);

    console.log(`completedList: ${completedList}`);

    //if the sign language id doesn't exist for that user, insert a new row
    if (completedList.length === 0) {
      await this.knex
        .insert({
          user_id: userID,
          sign_language_id: signLanguageID,
        })
        .into("complete_learning_list");
    }
  }
}
