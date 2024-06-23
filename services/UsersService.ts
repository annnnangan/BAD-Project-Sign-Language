import { Knex } from "knex";

export class UsersService {
  constructor(private knex: Knex) {}
  async getUserByEmail(email: string) {
    return await this.knex.select("*").from("users").where("email", email);
  }

  async getBookmarks(userID: number) {
    return await this.knex
      .select("bookmarks.sign_language_id", "sign_languages.sign_language")
      .from("bookmarks")
      .leftJoin(
        "sign_languages",
        "bookmarks.sign_language_id",
        "sign_languages.id"
      )
      .where("user_id", userID);
  }

  async removeBookmark(userID: number, signLanguage: string) {
    const signLanguageID = (
      await this.knex
        .select("id")
        .from("sign_languages")
        .where("sign_language", signLanguage)
    )[0].id;

    await this.knex("bookmarks")
      .where("user_id", userID)
      .andWhere("sign_language_id", signLanguageID)
      .del();
  }

  async insertBookmark(userID: number, signLanguage: string) {
    const signLanguageID = (
      await this.knex
        .select("id")
        .from("sign_languages")
        .where("sign_language", signLanguage)
    )[0].id;

    await this.knex
      .insert({
        user_id: userID,
        sign_language_id: signLanguageID,
      })
      .into("bookmarks");
  }
}
