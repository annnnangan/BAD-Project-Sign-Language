import { UsersService } from "./UsersService";
import { checkPassword, hashPassword } from "../utils/hash";

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
      //Insert a new users and return the email
      userEmail = (
        await knex
          .insert([
            {
              nickname: "Oscar",
              username: "oscar_lee_5555",
              email: "oscar_lee_5555@gamil.com",
              password:
                "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
              icon_id: 2,
            },
          ])
          .into("users")
          .returning("email")
      )[0].email;

      //Run the user service API
      const user = await usersService.getUserByEmail(userEmail);

      expect(user).toMatchObject([
        {
          nickname: "Oscar",
          username: "oscar_lee_5555",
          email: "oscar_lee_5555@gamil.com",
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
  });

  describe("Register Account", () => {
    it("should register account successfully", async () => {
      //user info that user has filled
      const userRegisterInfo = {
        nickname: "Oscar",
        username: "oscar_lee_5555",
        email: "oscar_lee_5555@gamil.com",
        password: "Tecky123",
        icon: "purple-shirt-man.png",
      };

      const registerResult = await usersService.register(userRegisterInfo);

      const newUser = await knex
        .select("*")
        .from("users")
        .where("username", userRegisterInfo.username);

      const newUserIconID = (
        await knex
          .select("icons.id as id")
          .from("icons")
          .innerJoin("users", "icons.id", "users.icon_id")
          .where("icon", userRegisterInfo.icon)
      )[0].id;

      //if register success, we should get a success status message
      expect(registerResult).toMatchObject({
        status: "success",
        message: "Successfully register",
      });

      //if register success, we should be able to find such 1 record in the user table
      expect(newUser.length).toBe(1);

      //if register success, we should be able to find such record in the user table
      expect(newUser).toMatchObject([
        {
          nickname: userRegisterInfo.nickname,
          username: userRegisterInfo.username,
          email: userRegisterInfo.email,
          icon_id: newUserIconID,
        },
      ]);

      //Check if password is correct
      const isCorrectPassword = await checkPassword(
        userRegisterInfo.password,
        newUser[0].password
      );

      expect(isCorrectPassword).toBeTruthy;

      await knex("users").where("username", userRegisterInfo.username).del();
    });

    it("should fail to register account because username and email exist", async () => {
      //user filled in existing email and username
      const userRegisterInfo = {
        nickname: "Amy",
        username: "amy_smile_1",
        email: "amy_smile_1@gmail.com",
        password: "Tecky123",
        icon: "blue-shirt-woman-2.png",
      };

      const registerResult = await usersService.register(userRegisterInfo);
      const user = await knex
        .select("*")
        .from("users")
        .where("username", userRegisterInfo.username)
        .andWhere("email", userRegisterInfo.email);

      //make sure we do not insert one more record in the database
      expect(user.length).toBe(1);

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

      const user = await knex
        .select("*")
        .from("users")
        .where("username", userRegisterInfo.username)
        .andWhere("email", userRegisterInfo.email);

      //make sure we do not insert the record in the database
      expect(user.length).toBe(0);

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

      const user = await knex
        .select("*")
        .from("users")
        .where("username", userRegisterInfo.username)
        .andWhere("email", userRegisterInfo.email);

      //make sure we do not insert the record in the database
      expect(user.length).toBe(0);

      expect(registerResult).toMatchObject({
        status: "error",
        message: [
          { errorFields: "email", message: "This email is being registered" },
        ],
      });
    });
  });

  describe("Bookmark", () => {
    let newUserID: number;

    beforeEach(async () => {
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
        .insert([
          {
            user_id: newUserID,
            sign_language_id: 1,
          },
          {
            user_id: newUserID,
            sign_language_id: 2,
          },
          {
            user_id: newUserID,
            sign_language_id: 3,
          },
        ])
        .into("bookmarks")
        .returning("id");
    });

    it("should return all bookmarks", async () => {
      const bookmarkLists = await usersService.getBookmarks(newUserID);

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
          sign_language: "c",
          sign_language_id: 3,
        },
      ]);
    });

    it("should remove bookmarks", async () => {
      await usersService.removeBookmark(newUserID, "a");

      const updatedBookmarkLists = await knex
        .select("bookmarks.sign_language_id")
        .from("bookmarks")
        .leftJoin(
          "sign_languages",
          "bookmarks.sign_language_id",
          "sign_languages.id"
        )
        .orderBy("bookmarks.sign_language_id", "asc")
        .where("user_id", newUserID);

      expect(updatedBookmarkLists.length).toBe(2);

      expect(updatedBookmarkLists).toMatchObject([
        {
          sign_language_id: 2,
        },
        {
          sign_language_id: 3,
        },
      ]);

      await knex
        .insert({ user_id: newUserID, sign_language_id: 1 })
        .into("bookmarks");
    });

    it.only("should add new bookmark", async () => {
      await usersService.insertBookmark(newUserID, "d");

      const updatedBookmarkLists = await knex
        .select("bookmarks.sign_language_id", "sign_languages.sign_language")
        .from("bookmarks")
        .leftJoin(
          "sign_languages",
          "bookmarks.sign_language_id",
          "sign_languages.id"
        )
        .orderBy("bookmarks.sign_language_id", "asc")
        .where("user_id", newUserID);

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
          sign_language: "c",
          sign_language_id: 3,
        },
        {
          sign_language: "d",
          sign_language_id: 4,
        },
      ]);

      await knex("bookmarks")
        .where("user_id", 4)
        .andWhere("sign_language_id", 4)
        .del();
    });

    afterEach(async () => {
      //remove bookmarks
      await knex("bookmarks").where("user_id", newUserID).del();
      //remove user
      await knex("users").where("id", newUserID).del();
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

    it("should accept friends request", async () => {
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

    it("should reject friends request", async () => {
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
