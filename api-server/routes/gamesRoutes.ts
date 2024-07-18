import express from "express";
import { gamesController } from "../main";

export const getGamesRoutes = () => {
  const gamesRoutes = express.Router();
  gamesRoutes.get("/learning-list", gamesController.getLearningList);
  gamesRoutes.get("/complete-learning-list", gamesController.getCompleteList);
  gamesRoutes.put(
    "/complete-list/:index",
    gamesController.updateCompleteLanguage
  );
  gamesRoutes.get("/quiz-list", gamesController.getQuizList);
  gamesRoutes.get("/quiz", gamesController.getQuizQuestion);
  gamesRoutes.get("/quiz-score", gamesController.getQuizHighestScore);
  gamesRoutes.put("/quiz-score", gamesController.updateQuizHighestScore);
  return gamesRoutes;
};
