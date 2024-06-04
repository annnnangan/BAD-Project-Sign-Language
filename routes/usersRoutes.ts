import express from "express";
import { usersController } from "../main";

export const getUsersRoutes = () => {
  const usersRoutes = express.Router();

  usersRoutes.post("/", usersController.getUsersLogin);

  return usersRoutes;
};
