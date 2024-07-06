import { GamesService } from "../services/GamesService";
import { GamesController } from "./GamesController";
import { Knex } from "knex";
import { Request, Response } from "express";
import { createRequest, createResponse } from "../utils/mock";

//toHaveBeenCalled
//toHaveBeenCalledWith
//toHaveBeenCalledTimes
//toHaveReturnedWith

describe("gamesController", () => {
  let gamesController: GamesController;
  let gamesService: GamesService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    gamesService = new GamesService({} as Knex);
    gamesController = new GamesController(gamesService);
    res = createResponse();
    req = createRequest();

    //Mock API in gamesService
    gamesService.getCompleteLanguage = jest.fn(async () => [
      { sign_language: "a" },
      { sign_language: "b" },
      { sign_language: "c" },
    ]);
  });

  describe("Learning", () => {
    it("should successfully get a list of completed languages", async () => {
      //todo: Mock user id
      req = { session: { user_id: 1 } } as unknown as Request;

      //todo: Run the controller API
      await gamesController.getCompleteList(req, res);
      //todo: Expect result
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        { sign_language: "a" },
        { sign_language: "b" },
        { sign_language: "c" },
      ]);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("should fail to get a list of completed languages due to no user ID", async () => {
      //todo: Mock user id
      req = { session: { user_id: "" } } as unknown as Request;
      //todo: Run the controller API
      await gamesController.getCompleteList(req, res);
      //todo: Expect result
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Missing UserID" });
      expect(res.json).toHaveBeenCalledTimes(1);
      expect(gamesService.getCompleteLanguage).not.toHaveBeenCalled();
    });

    it("should update complete language", async () => {
      //todo: Mock user id and sign language
      req = {
        params: { index: "a" },
        session: { user_id: 1 },
      } as unknown as Request;

      //todo: Mock API from gamesServices
      gamesService.completeLanguage = jest.fn(async () => ({
        message: "Insert successfully",
      }));

      //Call the API from gamesController
      await gamesController.updateCompleteLanguage(req, res);

      //todo: Expect result
      expect(gamesService.completeLanguage).toHaveBeenCalledWith(1, "a");
      expect(res.json).toHaveBeenCalledWith({
        message: "Insert successfully",
      });
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("should not update the complete language list because already exist", async () => {
      //todo: Mock user id and sign language
      req = {
        params: { index: "a" },
        session: { user_id: 1 },
      } as unknown as Request;

      //todo: Mock API from gamesServices
      gamesService.completeLanguage = jest.fn(async () => ({
        message: "The language has been completed before.",
      }));

      //Call the API from gamesController
      await gamesController.updateCompleteLanguage(req, res);

      //todo: Expect result
      expect(gamesService.completeLanguage).toHaveBeenCalledWith(1, "a");
      expect(res.json).toHaveBeenCalledWith({
        message: "The language has been completed before.",
      });
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  describe("Quiz", () => {
    it("should get quiz questions", async () => {
      //todo: mock quizID from query
      req = { query: { quiz: "1" } } as unknown as Request;
      //todo: mock service API
      gamesService.getQuizQuestion = jest.fn(async () => ({
        status: "success",
        data: [
          {
            quiz_id: 1,
            quiz: "Quiz 1",
            description: "A / B / C / D / E / F",
            question_type_id: 1,
            question: "What is the sign language of A?",
            image: null,
            answer: "A",
            choice: null,
          },
          {
            quiz_id: 1,
            quiz: "Quiz 1",
            description: "A / B / C / D / E / F",
            question_type_id: 1,
            question: "What is the sign language of B?",
            image: null,
            answer: "B",
            choice: null,
          },
          {
            quiz_id: 1,
            quiz: "Quiz 1",
            description: "A / B / C / D / E / F",
            question_type_id: 1,
            question: "What is the sign language of C?",
            image: null,
            answer: "C",
            choice: null,
          },
          {
            quiz_id: 1,
            quiz: "Quiz 1",
            description: "A / B / C / D / E / F",
            question_type_id: 2,
            question: "What sign language is it?",
            image: "question-1-7.png",
            answer: "A",
            choice: "A,B,E,F",
          },
          {
            quiz_id: 1,
            quiz: "Quiz 1",
            description: "A / B / C / D / E / F",
            question_type_id: 2,
            question: "What sign language is it?",
            image: "question-1-8.png",
            answer: "B",
            choice: "E,B,A,D",
          },
        ],
      }));
      //todo: call controller API
      await gamesController.getQuizQuestion(req, res);
      //todo: write expect result
      expect(gamesService.getQuizQuestion).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        data: [
          {
            quiz_id: 1,
            quiz: "Quiz 1",
            description: "A / B / C / D / E / F",
            question_type_id: 1,
            question: "What is the sign language of A?",
            image: null,
            answer: "A",
            choice: null,
          },
          {
            quiz_id: 1,
            quiz: "Quiz 1",
            description: "A / B / C / D / E / F",
            question_type_id: 1,
            question: "What is the sign language of B?",
            image: null,
            answer: "B",
            choice: null,
          },
          {
            quiz_id: 1,
            quiz: "Quiz 1",
            description: "A / B / C / D / E / F",
            question_type_id: 1,
            question: "What is the sign language of C?",
            image: null,
            answer: "C",
            choice: null,
          },
          {
            quiz_id: 1,
            quiz: "Quiz 1",
            description: "A / B / C / D / E / F",
            question_type_id: 2,
            question: "What sign language is it?",
            image: "question-1-7.png",
            answer: "A",
            choice: "A,B,E,F",
          },
          {
            quiz_id: 1,
            quiz: "Quiz 1",
            description: "A / B / C / D / E / F",
            question_type_id: 2,
            question: "What sign language is it?",
            image: "question-1-8.png",
            answer: "B",
            choice: "E,B,A,D",
          },
        ],
      });
    });

    it("should not get quiz questions due to invalid quiz id ", async () => {
      //todo: mock quizID from query
      req = { query: { quiz: "100" } } as unknown as Request;
      //todo: mock service API
      gamesService.getQuizQuestion = jest.fn(async () => ({
        status: "error",
        message: "Quiz doesn't exist.",
      }));
      //todo: call controller API
      await gamesController.getQuizQuestion(req, res);
      //todo: write expect result
      expect(gamesService.getQuizQuestion).toHaveBeenCalledWith(100);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: "Quiz doesn't exist.",
      });
    });

    it("should get quiz highest score ", async () => {
      //todo: mock quizID from query
      req = { session: { user_id: 1 } } as unknown as Request;
      //todo: mock service API
      gamesService.getQuizHighestScore = jest.fn(async () => [
        { user_id: 1, quiz_id: 1, highest_score: 2 },
        { user_id: 1, quiz_id: 2, highest_score: 4 },
        { user_id: 1, quiz_id: 3, highest_score: 1 },
      ]);
      //todo: call controller API
      await gamesController.getQuizHighestScore(req, res);
      //todo: write expect result
      expect(gamesService.getQuizHighestScore).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith([
        { user_id: 1, quiz_id: 1, highest_score: 2 },
        { user_id: 1, quiz_id: 2, highest_score: 4 },
        { user_id: 1, quiz_id: 3, highest_score: 1 },
      ]);
    });

    it("should update quiz highest score", async () => {
      //todo: mock quizID from query
      req = {
        session: { user_id: 1 },
        body: { quiz: 1, score: 5 },
      } as unknown as Request;
      //todo: mock service API
      gamesService.updateQuizHighestScore = jest.fn(async () => ({
        msg: "success",
      }));
      //todo: call controller API
      await gamesController.updateQuizHighestScore(req, res);
      //todo: write expect result
      expect(gamesService.updateQuizHighestScore).toHaveBeenCalledWith(1, 1, 5);
      expect(res.json).toHaveBeenCalledWith({ msg: "success" });
    });

    it("should not update quiz highest score because same or lower result", async () => {
      //todo: mock quizID from query
      req = {
        session: { user_id: 1 },
        body: { quiz: 1, score: 5 },
      } as unknown as Request;
      //todo: mock service API
      gamesService.updateQuizHighestScore = jest.fn(async () => ({
        msg: "Same Score / lower score",
      }));
      //todo: call controller API
      await gamesController.updateQuizHighestScore(req, res);
      //todo: write expect result
      expect(gamesService.updateQuizHighestScore).toHaveBeenCalledWith(1, 1, 5);
      expect(res.json).toHaveBeenCalledWith({
        msg: "Same Score / lower score",
      });
    });
  });
});
