import { UsersService } from "../services/UsersService";
import { UsersController } from "./UsersController";
import { Knex } from "knex";
import { Request, Response } from "express";
import { createRequest, createResponse } from "../utils/mock";

describe("gamesController", () => {
  let usersController: UsersController;
  let usersService: UsersService;
  let req: Request;
  let res: Response;

  beforeEach(() => {
    usersService = new UsersService({} as Knex);
    usersController = new UsersController(usersService);
    res = createResponse();
    req = createRequest();
  });

  describe("Login / Register", () => {
    it.skip("should not login as user not exist", async () => {
      //todo: Mock user id
      req = {
        body: { email: "test@gmail.com", password: "123456" },
      } as unknown as Request;

      //todo: Mock service API
      usersService.getUsersLogin = jest.fn(async () => ({
        status: "error",
      }));

      //todo: Run the controller API
      await usersController.getUsersLogin(req, res);
      //todo: Expect result
      expect(usersService.getUsersLogin).toHaveBeenCalledWith(
        "test@gmail.com",
        "123456"
      );
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({ message: "error" });
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("should login as user not exist", async () => {
      //todo: Mock user id
      req = {
        body: { email: "test@gmail.com", password: "123456" },
        session: {},
      } as unknown as Request;

      //todo: Mock service API
      usersService.getUsersLogin = jest.fn(async () => ({
        status: "success",
        message: { username: "test user", userID: 2 },
      }));

      //todo: Run the controller API
      await usersController.getUsersLogin(req, res);

      //todo: mock assigning user name and id to req.session

      req = {
        session: { user: "test user", user_id: 2 },
      } as unknown as Request;

      //todo: Expect result
      expect(usersService.getUsersLogin).toHaveBeenCalledWith(
        "test@gmail.com",
        "123456"
      );
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "success" });
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("should register account", async () => {
      //todo: Mock user id
      req = {
        body: {
          nickname: "test user",
          username: "test user",
          email: "test@gmail.com",
          password: "123456",
          icon: "icon_image.png",
        },
        session: {},
      } as unknown as Request;

      //todo: Mock service API
      usersService.register = jest.fn(async () => ({
        status: "success",
        message: "Successfully register",
        users: { username: "test user", userID: 10 },
      }));

      //todo: Run the controller API
      await usersController.register(req, res);

      //todo: mock assigning user name and id to req.session
      req = {
        session: { user: "test user", user_id: 10 },
      } as unknown as Request;

      //todo: Expect result
      expect(usersService.register).toHaveBeenCalledWith({
        nickname: "test user",
        username: "test user",
        email: "test@gmail.com",
        password: "123456",
        icon: "icon_image.png",
      });

      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "Successfully register",
        users: { username: "test user", userID: 10 },
      });
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });
  describe("Bookmarks", () => {
    it("should get bookmark", async () => {
      //todo: Mock user id
      req = {
        session: { user_id: 1 },
      } as unknown as Request;

      //todo: Mock service API
      usersService.getBookmarks = jest.fn(async () => [
        {
          sign_language_id: 1,
          sign_language: "a",
        },
        {
          sign_language_id: 2,
          sign_language: "b",
        },
      ]);

      //todo: Run the controller API
      await usersController.getBookmarks(req, res);

      //todo: Expect result
      expect(usersService.getBookmarks).toHaveBeenCalledWith(1);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith([
        {
          sign_language_id: 1,
          sign_language: "a",
        },
        {
          sign_language_id: 2,
          sign_language: "b",
        },
      ]);
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("should remove bookmark", async () => {
      //todo: Mock user id
      req = {
        session: { user_id: 1 },
        params: { signLanguage: "a" },
      } as unknown as Request;

      //todo: Mock service API
      usersService.removeBookmark = jest.fn();

      //todo: Run the controller API
      await usersController.removeBookmark(req, res);

      //todo: Expect result
      expect(usersService.removeBookmark).toHaveBeenCalledWith(1, "a");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "remove successfully" });
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("should insert new bookmark", async () => {
      //todo: Mock user id
      req = {
        session: { user_id: 1 },
        body: { signLanguage: "a" },
      } as unknown as Request;

      //todo: Mock service API
      usersService.insertBookmark = jest.fn();

      //todo: Run the controller API
      await usersController.insertBookmark(req, res);

      //todo: Expect result
      expect(usersService.insertBookmark).toHaveBeenCalledWith(1, "a");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: "insert successfully" });
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  describe("Rank", () => {
    it("should get rank", async () => {
      //todo: Mock user id
      req = {
        session: { user_id: 1 },
      } as unknown as Request;

      //todo: Mock service API
      usersService.getRank = jest.fn(async () => [
        {
          user_id: 1,
          nickname: "Test User",
          username: "testuser",
          icon: "icon_image.png",
          total_score: 10,
        },
        {
          user_id: 2,
          nickname: "Test User 2",
          username: "testuser2",
          icon: "icon_image.png",
          total_score: 5,
        },
        {
          user_id: 3,
          nickname: "Test User 3",
          username: "testuser3",
          icon: "icon_image.png",
          total_score: 4,
        },
      ]);

      //todo: Run the controller API
      await usersController.getRank(req, res);

      //todo: Expect result
      expect(usersService.getRank).toHaveBeenCalledWith(1);
      expect(res.json).toHaveBeenCalledWith([
        {
          user_id: 1,
          nickname: "Test User",
          username: "testuser",
          icon: "icon_image.png",
          total_score: 10,
        },
        {
          user_id: 2,
          nickname: "Test User 2",
          username: "testuser2",
          icon: "icon_image.png",
          total_score: 5,
        },
        {
          user_id: 3,
          nickname: "Test User 3",
          username: "testuser3",
          icon: "icon_image.png",
          total_score: 4,
        },
      ]);
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });

  describe("friends", () => {
    it("should add friends", async () => {
      //todo: Mock user id
      req = {
        session: { user_id: 1 },
        body: { username: "new user" },
      } as unknown as Request;

      //todo: Mock service API
      usersService.addNewFriends = jest.fn(async () => ({
        status: "success",
        message: `Your friend request has sent to new user.`,
      }));

      //todo: Run the controller API
      await usersController.addNewFriends(req, res);

      //todo: Expect result
      expect(usersService.addNewFriends).toHaveBeenCalledWith(1, "new user");
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: `Your friend request has sent to new user.`,
      });
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("should not add friends because user doesn't exist", async () => {
      //todo: Mock user id
      req = {
        session: { user_id: 1 },
        body: { username: "new user" },
      } as unknown as Request;

      //todo: Mock service API
      usersService.addNewFriends = jest.fn(async () => ({
        status: "error",
        message: `User does not exist.`,
      }));

      //todo: Run the controller API
      await usersController.addNewFriends(req, res);

      //todo: Expect result
      expect(usersService.addNewFriends).toHaveBeenCalledWith(1, "new user");
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: "error",
        message: `User does not exist.`,
      });
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("should accept friends", async () => {
      //todo: Mock user id
      req = {
        session: { user_id: 1 },
        body: { requesterUsername: "new user" },
      } as unknown as Request;

      //todo: Mock service API
      usersService.acceptFriends = jest.fn(async () => ({
        status: "success",
        message: "accept friends successfully",
      }));

      //todo: Run the controller API
      await usersController.acceptFriends(req, res);

      //todo: Expect result
      expect(usersService.acceptFriends).toHaveBeenCalledWith(1, "new user");
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "accept friends successfully",
      });
      expect(res.json).toHaveBeenCalledTimes(1);
    });

    it("should reject friends", async () => {
      //todo: Mock user id
      req = {
        session: { user_id: 1 },
        body: { requesterUsername: "new user" },
      } as unknown as Request;

      usersService.rejectFriends = jest.fn(async () => ({
        status: "success",
        message: "reject friends successfully",
      }));

      //todo: Run the controller API
      await usersController.rejectFriends(req, res);

      //todo: Expect result
      expect(usersService.rejectFriends).toHaveBeenCalledWith(1, "new user");
      expect(res.json).toHaveBeenCalledWith({
        status: "success",
        message: "reject friends successfully",
      });
      expect(res.json).toHaveBeenCalledTimes(1);
    });
  });
});
