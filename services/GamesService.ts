import { Knex } from "knex";

export class GamesService {
  constructor(private knex: Knex) {}
  async getLearningList() {
    return await this.knex.select("*").from("sign_languages");
  }
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

  async getQuizList() {
    return await this.knex.select("*").from("quizzes");
  }

  async getQuizQuestion(quizID: number) {
    if (quizID != 5) {
      return await this.knex
        .select(
          "quizzes.quiz",
          "quizzes.description",
          "quiz_questions.question_type_id",
          "quiz_questions.question",
          "quiz_questions.image",
          "quiz_questions.answer",
          "quiz_choices.choice"
        )
        .from("quiz_questions")
        .orderByRaw("RANDOM()")
        .limit(5)
        .leftJoin(
          "quiz_choices",
          "quiz_questions.id",
          "quiz_choices.question_id"
        )
        .leftJoin("quizzes", "quiz_questions.quiz_id", "quizzes.id")
        .where("quiz_id", quizID);
    } else {
      return await this.knex
        .select(
          "quizzes.quiz",
          "quizzes.description",
          "quiz_questions.question_type_id",
          "quiz_questions.question",
          "quiz_questions.image",
          "quiz_questions.answer",
          "quiz_choices.choice"
        )
        .from("quiz_questions")
        .orderByRaw("RANDOM()")
        .limit(5)
        .leftJoin(
          "quiz_choices",
          "quiz_questions.id",
          "quiz_choices.question_id"
        )
        .leftJoin("quizzes", "quiz_questions.quiz_id", "quizzes.id");
    }
  }

  async getQuizHighestScore(userID: number) {
    return await this.knex
      .select("quiz_id", "highest_score")
      .from("quiz_scores")
      .where("user_id", userID);
  }

  async updateQuizHighestScore(userID: number, quizID: number, score: number) {
    const existingScore = await this.knex
      .select("highest_score")
      .from("quiz_scores")
      .where("user_id", userID)
      .andWhere("quiz_id", quizID);

    console.log("existingScore", existingScore);
    console.log("score", score);

    if (existingScore[0]) {
      if (score > existingScore[0].highest_score) {
        await this.knex("quiz_scores")
          .update("highest_score", score)
          .where("user_id", userID)
          .andWhere("quiz_id", quizID);
        return { msg: "success" };
      } else {
        return { msg: "Same Score" };
      }
    } else {
      await this.knex
        .insert({
          user_id: userID,
          quiz_id: quizID,
          highest_score: score,
        })
        .into("quiz_scores");
      return { msg: "success" };
    }
  }
}
