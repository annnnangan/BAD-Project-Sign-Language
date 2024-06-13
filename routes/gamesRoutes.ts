import express from "express";
import { gamesController } from "../main";

export const getGamesRoutes = () => {
  const gamesRoutes = express.Router();
  gamesRoutes.get("/learning-list", gamesController.getCompleteList);
  gamesRoutes.put(
    "/complete-list/:index",
    gamesController.updateCompleteLanguage
  );
  gamesRoutes.get("/quiz-list", gamesController.getQuizList);
  gamesRoutes.get("/quiz", gamesController.getQuizQuestion);
  return gamesRoutes;
};
