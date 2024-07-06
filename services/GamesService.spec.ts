import { hashPassword } from "../utils/hash";
import { GamesService } from "./GamesService";

import Knex from "knex";
const knexConfig = require("../knexfile");
const knex = Knex(knexConfig["test"]);

describe("GamesService", () => {
  let gamesService: GamesService;

  beforeEach(async () => {
    gamesService = new GamesService(knex);
  });

  describe("Learning", () => {
    let newUserID: number;
    beforeAll(async () => {
      //create new users
      const newUserInfo = {
        nickname: "Oscar",
        username: "oscar_lee_5555",
        email: "oscar_lee_5555@gamil.com",
        password: "Tecky123",
        icon: "purple-shirt-man.png",
      };

      const newUserIconID = (
        await knex.select("id").from("icons").where("icon", newUserInfo.icon)
      )[0].id;

      newUserID = (
        await knex
          .insert({
            nickname: newUserInfo.nickname,
            username: newUserInfo.username,
            email: newUserInfo.email,
            password: await hashPassword(newUserInfo.password),
            icon_id: newUserIconID,
          })
          .into("users")
          .returning("users.id")
      )[0].id;
    });

    it("should get 3 completed language", async () => {
      await knex
        .insert([
          { user_id: newUserID, sign_language_id: 1 },
          { user_id: newUserID, sign_language_id: 2 },
          { user_id: newUserID, sign_language_id: 3 },
        ])
        .into("complete_learning_list");

      const completedLanguageList = await gamesService.getCompleteLanguage(
        newUserID
      );
      expect(completedLanguageList.length).toBe(3);

      expect(completedLanguageList).toMatchObject([
        { sign_language: "a" },
        { sign_language: "b" },
        { sign_language: "c" },
      ]);
    });

    it("should complete a language", async () => {
      const signLanguage = "e";
      const resultMessage = await gamesService.completeLanguage(
        newUserID,
        signLanguage
      );

      const signLanguageID = (
        await knex
          .select("id")
          .from("sign_languages")
          .where("sign_language", signLanguage)
      )[0].id;

      const result = await knex
        .select("user_id", "sign_language_id")
        .from("complete_learning_list")
        .where("user_id", newUserID)
        .andWhere("sign_language_id", signLanguageID);

      expect(resultMessage).toMatchObject({ message: "Insert successfully" });
      expect(result.length).toBe(1);
      expect(result).toMatchObject([
        { user_id: newUserID, sign_language_id: signLanguageID },
      ]);
    });

    afterEach(async () => {
      await knex("complete_learning_list").where("user_id", newUserID).del();
    });

    afterAll(async () => {
      await knex("users").where("id", newUserID).del();
    });
  });

  describe("Return Quiz Lists", () => {
    it("should return own quiz questions for a non-5's quizID", async () => {
      const quizID = 3;
      const result = await gamesService.getQuizQuestion(quizID);

      expect(result.status).toBe("success");
      expect(result.data).toBeLessThanOrEqual(5);

      result.data?.forEach((question) => {
        expect(question).toHaveProperty("quiz");
        expect(question).toHaveProperty("description");
        expect(question).toHaveProperty("question_type_id");
        expect(question).toHaveProperty("question");
        expect(question).toHaveProperty("image");
        expect(question).toHaveProperty("answer");
        expect(question).toHaveProperty("choice");
      });

      result.data?.forEach((question) => {
        expect(question.quiz_id).toBe(quizID);
      });
    });

    it("should return quiz questions from different quizzes for quizID 5", async () => {
      const quizID = 5;
      const result = await gamesService.getQuizQuestion(quizID);
      expect(result.status).toBe("success");
      expect(result.data).toBeLessThanOrEqual(5);

      result.data?.forEach((question) => {
        expect(question).toHaveProperty("quiz");
        expect(question).toHaveProperty("description");
        expect(question).toHaveProperty("question_type_id");
        expect(question).toHaveProperty("question");
        expect(question).toHaveProperty("image");
        expect(question).toHaveProperty("answer");
        expect(question).toHaveProperty("choice");
      });
    });
  });

  describe("Quiz Scores", () => {
    let newUserID: number;
    beforeAll(async () => {
      //create new users
      const newUserInfo = {
        nickname: "Oscar",
        username: "oscar_lee_5555",
        email: "oscar_lee_5555@gamil.com",
        password: "Tecky123",
        icon: "purple-shirt-man.png",
      };

      const newUserIconID = (
        await knex.select("id").from("icons").where("icon", newUserInfo.icon)
      )[0].id;

      newUserID = (
        await knex
          .insert({
            nickname: newUserInfo.nickname,
            username: newUserInfo.username,
            email: newUserInfo.email,
            password: await hashPassword(newUserInfo.password),
            icon_id: newUserIconID,
          })
          .into("users")
          .returning("users.id")
      )[0].id;

      await knex
        .insert({ user_id: newUserID, quiz_id: 1, highest_score: 3 })
        .into("quiz_scores");
    });

    it("should get the highest score", async () => {
      const result = await gamesService.getQuizHighestScore(newUserID);
      expect(result.length).toBe(1);
      expect(result).toMatchObject([{ quiz_id: 1, highest_score: 3 }]);
    });

    it("should update quiz highest score when new quiz score is higher than the existing result", async () => {
      const result = await gamesService.updateQuizHighestScore(newUserID, 1, 4);

      const newScore = (
        await knex
          .select("highest_score")
          .from("quiz_scores")
          .where("user_id", newUserID)
          .andWhere("quiz_id", 1)
      )[0].highest_score;

      expect(result).toMatchObject({ msg: "success" });
      expect(newScore).toEqual(4);

      await knex("quiz_scores").update("highest_score", 3);
    });

    it("should not update quiz highest score when new quiz score is lower than the existing result", async () => {
      const result = await gamesService.updateQuizHighestScore(newUserID, 1, 2);
      const score = (
        await knex
          .select("highest_score")
          .from("quiz_scores")
          .where("user_id", newUserID)
          .andWhere("quiz_id", 1)
      )[0].highest_score;

      expect(result).toMatchObject({ msg: "Same Score / lower score" });
      expect(score).toEqual(3);
    });

    afterAll(async () => {
      await knex("quiz_scores").where("user_id", newUserID).del();
      await knex("users").where("id", newUserID).del();
    });
  });

  afterAll(async () => {
    await knex.destroy();
  });
});
