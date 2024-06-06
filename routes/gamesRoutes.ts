import express from "express";
import { gamesController } from "../main";

export const getGamesRoutes = () => {
  const gamesRoutes = express.Router();
  gamesRoutes.get("/learning-list", gamesController.getCompleteList);
  gamesRoutes.put(
    "/complete-list/:index",
    gamesController.updateCompleteLanguage
  );
  return gamesRoutes;
};
