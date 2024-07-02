import { UsersService } from "./UsersService";

import Knex from "knex";
const knexConfig = require("../knexfile");
const knex = Knex(knexConfig["test"]);
describe("UsersService", () => {
  let usersService: UsersService;
  beforeEach(async () => {
    usersService = new UsersService(knex);
  });
  describe("User Login", () => {
    let userEmail: string;

    it("should get user", async () => {
      userEmail = (
        await knex
          .insert([
            {
              nickname: "Ken",
              username: "ken_ken",
              email: "ken_lee@gamil.com",
              password:
                "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
              icon_id: 2,
            },
          ])
          .into("users")
          .returning("email")
      )[0].email;

      const user = await usersService.getUserByEmail(userEmail);

      expect(user).toMatchObject([
        {
          nickname: "Ken",
          username: "ken_ken",
          email: "ken_lee@gamil.com",
          password:
            "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
          icon_id: 2,
        },
      ]);

      await knex("users").where("email", userEmail).del();
    });

    it("should not get user", async () => {
      const userEmail = "not_exist_email@gamil.com";
      const user = await usersService.getUserByEmail(userEmail);

      expect(user).toEqual([]);
    });
    //each time when we run, we should delete the testing data we just insert, otherwise there will be tons of data
    // afterEach(async () => {
    //   await knex("users").where("id", userID).del();
    // });

    //stop the knex connection after running all the test case
  });

  describe("Register Account", () => {
    it("should register account successfully", async () => {
      const userRegisterInfo = {
        nickname: "Ken",
        username: "ken_ken",
        email: "ken_lee@gamil.com",
        password: "Tecky123",
        icon: "purple-shirt-man.png",
      };

      const registerResult = await usersService.register(userRegisterInfo);

      const newUser = await knex
        .select("users.*")
        .from("users")
        .where("username", "ken_ken");

      expect(registerResult).toMatchObject({
        status: "success",
        message: "Successfully register",
      });

      expect(newUser.length).toBe(1);

      expect(newUser).toMatchObject([
        {
          nickname: "Ken",
          username: "ken_ken",
          email: "ken_lee@gamil.com",
          icon_id: 10,
        },
      ]);

      await knex("users").where("username", userRegisterInfo.username).del();
    });

    it("should fail to register account because username and email exist", async () => {
      const userRegisterInfo = {
        nickname: "Amy",
        username: "amy_smile_1",
        email: "amy_smile_1@gmail.com",
        password: "Tecky123",
        icon: "blue-shirt-woman-2.png",
      };

      const registerResult = await usersService.register(userRegisterInfo);

      expect(registerResult).toMatchObject({
        status: "error",
        message: [
          {
            errorFields: "username",
            message: "This username is being registered.",
          },
          {
            errorFields: "email",
            message: "This email is being registered.",
          },
        ],
      });
    });

    it("should fail to register account because username exist", async () => {
      const userRegisterInfo = {
        nickname: "Amy",
        username: "amy_smile_1",
        email: "amy@gmail.com",
        password: "Tecky123",
        icon: "blue-shirt-woman-2.png",
      };

      const registerResult = await usersService.register(userRegisterInfo);

      expect(registerResult).toMatchObject({
        status: "error",
        message: [
          {
            errorFields: "username",
            message: "This username is being registered",
          },
        ],
      });
    });

    it("should fail to register account because email exist", async () => {
      const userRegisterInfo = {
        nickname: "Amy",
        username: "amy_smile_2",
        email: "amy_smile_1@gmail.com",
        password: "Tecky123",
        icon: "blue-shirt-woman-2.png",
      };

      const registerResult = await usersService.register(userRegisterInfo);

      expect(registerResult).toMatchObject({
        status: "error",
        message: [
          { errorFields: "email", message: "This email is being registered" },
        ],
      });
    });

    //stop the knex connection after running all the test case
  });

  describe("Bookmark", () => {
    it("should return all bookmarks", async () => {
      const bookmarkLists = await usersService.getBookmarks(4);

      expect(bookmarkLists.length).toBe(3);

      expect(bookmarkLists).toMatchObject([
        {
          sign_language: "a",
          sign_language_id: 1,
        },
        {
          sign_language: "b",
          sign_language_id: 2,
        },
        {
          sign_language: "g",
          sign_language_id: 7,
        },
      ]);
    });

    it("should remove bookmarks", async () => {
      await usersService.removeBookmark(4, "a");

      const updatedBookmarkLists = await knex
        .select("bookmarks.sign_language_id", "sign_languages.sign_language")
        .from("bookmarks")
        .leftJoin(
          "sign_languages",
          "bookmarks.sign_language_id",
          "sign_languages.id"
        )
        .orderBy("bookmarks.sign_language_id", "asc")
        .where("user_id", 4);

      expect(updatedBookmarkLists.length).toBe(2);

      expect(updatedBookmarkLists).toMatchObject([
        {
          sign_language: "b",
          sign_language_id: 2,
        },
        {
          sign_language: "g",
          sign_language_id: 7,
        },
      ]);

      await knex.insert({ user_id: 4, sign_language_id: 1 }).into("bookmarks");
    });

    it("should add new bookmark", async () => {
      await usersService.insertBookmark(4, "d");

      const updatedBookmarkLists = await knex
        .select("bookmarks.sign_language_id", "sign_languages.sign_language")
        .from("bookmarks")
        .leftJoin(
          "sign_languages",
          "bookmarks.sign_language_id",
          "sign_languages.id"
        )
        .orderBy("bookmarks.sign_language_id", "asc")
        .where("user_id", 4);

      expect(updatedBookmarkLists.length).toBe(4);

      expect(updatedBookmarkLists).toMatchObject([
        {
          sign_language: "a",
          sign_language_id: 1,
        },
        {
          sign_language: "b",
          sign_language_id: 2,
        },
        {
          sign_language: "d",
          sign_language_id: 4,
        },
        {
          sign_language: "g",
          sign_language_id: 7,
        },
      ]);

      await knex("bookmarks")
        .where("user_id", 4)
        .andWhere("sign_language_id", 4)
        .del();
    });
  });

  describe("Ranking", () => {
    it("should get 4 users in the ranking", async () => {
      const rankList = await usersService.getRank(3);
      expect(rankList.length).toBe(4);

      expect(rankList).toMatchObject([
        {
          user_id: 1,
          total_score: "6",
        },
        {
          user_id: 3,
          total_score: "4",
        },
        {
          user_id: 5,
          total_score: "2",
        },
        {
          user_id: 6,
          total_score: "2",
        },
      ]);
    });

    it("should get no ranking", async () => {
      const newUserID = (
        await knex
          .insert([
            {
              nickname: "Ken",
              username: "ken_ken",
              email: "ken_lee@gamil.com",
              password:
                "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
              icon_id: 2,
            },
          ])
          .into("users")
          .returning("id")
      )[0].id;

      const rankList = await usersService.getRank(newUserID);

      expect(rankList.length).toBe(0);
      expect(rankList).toMatchObject([]);

      await knex("users").where("id", newUserID).del();
    });
  });

  describe("Friends", () => {
    it("should get 1 pending friend request sent from others", async () => {
      const receivedPendingRequest =
        await usersService.getReceivedFriendRequests(3);
      expect(receivedPendingRequest.length).toBe(1);
      expect(receivedPendingRequest).toMatchObject([
        {
          requester_id: 2,
        },
      ]);
    });

    it("should get 0 pending friend request sent from others", async () => {
      const receivedPendingRequest =
        await usersService.getReceivedFriendRequests(1);
      expect(receivedPendingRequest.length).toBe(0);
    });

    it("successfully add new friends", async () => {
      const result = await usersService.addNewFriends(8, "amy_smile_1");
      expect(result).toMatchObject({
        status: "success",
        message: "Your friend request has sent to amy_smile_1.",
      });

      await knex("friends")
        .where("requester_id", 8)
        .andWhere("requestee_id", 2)
        .del();
    });

    it("fail to add friend because you two are friends already", async () => {
      const result = await usersService.addNewFriends(8, "annangan1234");
      expect(result).toMatchObject({
        status: "error",
        message: "annangan1234 are your friend already",
      });
    });

    it("fail to add new friends because the username doesn't exist", async () => {
      const result = await usersService.addNewFriends(8, "notexist_username");
      expect(result).toMatchObject({
        status: "error",
        message: "User does not exist.",
      });
    });

    it.only("should accept friends request", async () => {
      await usersService.acceptFriends(4, "amy_smile_1");

      const friendStatus = (
        await knex
          .select("status")
          .from("friends")
          .where("requester_id", 2)
          .andWhere("requestee_id", 4)
      )[0].status;

      expect(friendStatus).toBe("Accept");

      await knex("friends")
        .update("status", "Pending")
        .where("requester_id", 2)
        .andWhere("requestee_id", 4);
    });

    it.only("should reject friends request", async () => {
      await usersService.rejectFriends(4, "amy_smile_1");

      const friendStatus = (
        await knex
          .select("status")
          .from("friends")
          .where("requester_id", 2)
          .andWhere("requestee_id", 4)
      )[0].status;

      expect(friendStatus).toBe("Reject");

      await knex("friends")
        .update("status", "Pending")
        .where("requester_id", 2)
        .andWhere("requestee_id", 4);
    });
  });

  afterAll(async () => {
    await knex.destroy();
  });
});
