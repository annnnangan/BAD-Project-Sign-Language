import express from "express";
import { usersController } from "../main";
import { isLoggedInAPI } from "../utils/guard";

export const getUsersRoutes = () => {
  const usersRoutes = express.Router();

  usersRoutes.post("/login", usersController.getUsersLogin);
  usersRoutes.get("/bookmarks", isLoggedInAPI, usersController.getBookmarks);
  usersRoutes.delete(
    "/bookmarks/:signLanguage",
    isLoggedInAPI,
    usersController.removeBookmark
  );
  usersRoutes.post("/bookmarks", isLoggedInAPI, usersController.insertBookmark);
  usersRoutes.get("/rank", isLoggedInAPI, usersController.getRank);

  return usersRoutes;
};
