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
      return { message: "Insert successfully" };
    } else {
      return { message: "The language has been completed before." };
    }
  }

  async getQuizList() {
    return await this.knex.select("*").from("quizzes");
  }

  async getQuizQuestion(quizID: number) {
    //check if quiz id exist in database, return error message if not exist
    const isQuizExist = await this.knex
      .select("id")
      .from("quizzes")
      .where("id", quizID);

    if (isQuizExist.length == 0) {
      return { status: "error", message: "Quiz doesn't exist." };
    }

    if (quizID != 5) {
      const questionLists = await this.knex
        .select(
          "quiz_questions.quiz_id",
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
      return { status: "success", data: questionLists };
    } else {
      const questionLists = await this.knex
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

      return { status: "success", data: questionLists };
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

    if (existingScore[0]) {
      if (score > existingScore[0].highest_score) {
        await this.knex("quiz_scores")
          .update("highest_score", score)
          .where("user_id", userID)
          .andWhere("quiz_id", quizID);
        return { msg: "success" };
      } else {
        return { msg: "Same Score / lower score" };
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
