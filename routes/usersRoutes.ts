import express from "express";
import { usersController } from "../main";
import { isLoggedInAPI } from "../utils/guard";

export const getUsersRoutes = () => {
  const usersRoutes = express.Router();

  usersRoutes.post("/login", usersController.getUsersLogin);
  usersRoutes.get("/icons", usersController.getIcons);
  usersRoutes.post("/register", usersController.register);
  usersRoutes.get("/profile", isLoggedInAPI, usersController.getUserProfile);
  usersRoutes.get(
    "/complete-lesson-count",
    isLoggedInAPI,
    usersController.getUserCompleteLesson
  );
  usersRoutes.get(
    "/complete-quiz-count",
    isLoggedInAPI,
    usersController.getUserCompleteQuiz
  );
  usersRoutes.get("/bookmarks", isLoggedInAPI, usersController.getBookmarks);
  usersRoutes.delete(
    "/bookmarks/:signLanguage",
    isLoggedInAPI,
    usersController.removeBookmark
  );
  usersRoutes.post("/bookmarks", isLoggedInAPI, usersController.insertBookmark);
  usersRoutes.get("/rank", isLoggedInAPI, usersController.getRank);
  usersRoutes.get(
    "/received-friend-requests",
    isLoggedInAPI,
    usersController.getReceivedFriendRequests
  );
  usersRoutes.get(
    "/sent-friend-requests",
    isLoggedInAPI,
    usersController.getSentFriendRequests
  );

  usersRoutes.post("/add-friend", isLoggedInAPI, usersController.addNewFriends);
  usersRoutes.post(
    "/accept-friend",
    isLoggedInAPI,
    usersController.acceptFriends
  );
  usersRoutes.post(
    "/reject-friend",
    isLoggedInAPI,
    usersController.rejectFriends
  );

  return usersRoutes;
};
