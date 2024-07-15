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
    it("login successfully", async () => {
      //Insert a new users and return the email
      const newUser = (
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
          .returning(["id", "username", "email", "password"])
      )[0];

      const result = await usersService.getUsersLogin(
        "oscar_lee_5555@gamil.com",
        "Tecky123"
      );

      expect(result).toMatchObject({
        status: "success",
        message: { userID: newUser.id, username: newUser.username },
      });

      await knex("users").where("email", newUser.email).del();
    });

    it("fail to login due to incorrect user email", async () => {
      const userEmail = "not_exist_email@gamil.com";
      const userPassword = "Tecky123";
      const user = await usersService.getUsersLogin(userEmail, userPassword);

      expect(user).toEqual({ status: "error" });
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

    afterEach(async () => {
      //remove user
      await knex("users").where("nickname", "Oscar").del();
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
        icon_id: 2,
      };

      newUserID = (
        await knex
          .insert({
            nickname: newUserInfo.nickname,
            username: newUserInfo.username,
            email: newUserInfo.email,
            password: await hashPassword(newUserInfo.password),
            icon_id: newUserInfo.icon_id,
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
        .into("bookmarks");
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
    });

    it("should add new bookmark", async () => {
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
    });

    afterEach(async () => {
      //remove bookmarks
      await knex("bookmarks").where("user_id", newUserID).del();
      //remove user
      await knex("users").where("id", newUserID).del();
    });
  });

  describe("Ranking", () => {
    let newUserOneID: number;
    let newUserTwoID: number;
    let friendStatusID: number;

    beforeAll(async () => {
      const newUserOne = {
        nickname: "Oscar",
        username: "oscar_lee_5555",
        email: "oscar_lee_5555@gamil.com",
        password: "Tecky123",
        icon: "purple-shirt-man.png",
      };

      const newUserTwo = {
        nickname: "Lily",
        username: "lily_kk",
        email: "lily_kk@gamil.com",
        password: "Tecky123",
        icon: "purple-shirt-woman-2.png",
      };

      const newUserOneIconID = (
        await knex.select("id").from("icons").where("icon", newUserOne.icon)
      )[0].id;

      const newUserTwoIconID = (
        await knex.select("id").from("icons").where("icon", newUserTwo.icon)
      )[0].id;

      newUserOneID = (
        await knex
          .insert({
            nickname: newUserOne.nickname,
            username: newUserOne.username,
            email: newUserOne.email,
            password: await hashPassword(newUserOne.password),
            icon_id: newUserOneIconID,
          })
          .into("users")
          .returning("users.id")
      )[0].id;

      newUserTwoID = (
        await knex
          .insert({
            nickname: newUserTwo.nickname,
            username: newUserTwo.username,
            email: newUserTwo.email,
            password: await hashPassword(newUserTwo.password),
            icon_id: newUserTwoIconID,
          })
          .into("users")
          .returning("users.id")
      )[0].id;

      friendStatusID = (
        await knex
          .insert([
            {
              requester_id: newUserOneID,
              requestee_id: newUserTwoID,
              status: "Accept",
            },
          ])
          .into("friends")
          .returning("id")
      )[0].id;
    });

    it("should get 2 users in the ranking", async () => {
      await knex
        .insert([
          {
            user_id: newUserOneID,
            quiz_id: 1,
            highest_score: 5,
          },
          {
            user_id: newUserTwoID,
            quiz_id: 1,
            highest_score: 2,
          },
        ])
        .into("quiz_scores");

      const rankList = await usersService.getRank(newUserOneID);
      expect(rankList.length).toBe(2);

      expect(rankList).toMatchObject([
        {
          user_id: newUserOneID,
          total_score: "5",
        },
        {
          user_id: newUserTwoID,
          total_score: "2",
        },
      ]);

      await knex("quiz_scores").where("user_id", newUserOneID).del();
      await knex("quiz_scores").where("user_id", newUserTwoID).del();
    });

    it("should get no ranking", async () => {
      const rankList = await usersService.getRank(newUserOneID);
      console.log(rankList);
      expect(rankList.length).toBe(0);
      expect(rankList).toMatchObject([]);
    });

    afterEach(async () => {
      await knex("friends").where("id", friendStatusID).del();
      await knex("users").where("id", newUserOneID).del();
      await knex("users").where("id", newUserTwoID).del();
    });
  });

  describe("Friends", () => {
    let newUserOne: {
      id: number;
      username: string;
      nickname: string;
    };
    let newUserTwo: {
      id: number;
      username: string;
      nickname: string;
    };

    beforeAll(async () => {
      const newUserOneInfo = {
        nickname: "Oscar",
        username: "oscar_lee_5555",
        email: "oscar_lee_5555@gamil.com",
        password: "Tecky123",
        icon: "purple-shirt-man.png",
      };

      const newUserTwoInfo = {
        nickname: "Lily",
        username: "lily_kk",
        email: "lily_kk@gamil.com",
        password: "Tecky123",
        icon: "purple-shirt-woman-2.png",
      };

      const newUserOneIconID = (
        await knex.select("id").from("icons").where("icon", newUserOneInfo.icon)
      )[0].id;

      const newUserTwoIconID = (
        await knex.select("id").from("icons").where("icon", newUserTwoInfo.icon)
      )[0].id;

      newUserOne = (
        await knex
          .insert({
            nickname: newUserOneInfo.nickname,
            username: newUserOneInfo.username,
            email: newUserOneInfo.email,
            password: await hashPassword(newUserOneInfo.password),
            icon_id: newUserOneIconID,
          })
          .into("users")
          .returning(["id", "username", "nickname"])
      )[0];

      newUserTwo = (
        await knex
          .insert({
            nickname: newUserTwoInfo.nickname,
            username: newUserTwoInfo.username,
            email: newUserTwoInfo.email,
            password: await hashPassword(newUserTwoInfo.password),
            icon_id: newUserTwoIconID,
          })
          .into("users")
          .returning(["id", "username", "nickname"])
      )[0];
    });

    it("should get 1 pending friend request sent from others", async () => {
      await knex
        .insert([
          {
            requester_id: newUserTwo.id,
            requestee_id: newUserOne.id,
            status: "Pending",
          },
        ])
        .into("friends");

      const receivedPendingRequest =
        await usersService.getReceivedFriendRequests(newUserOne.id);
      expect(receivedPendingRequest.length).toBe(1);
      expect(receivedPendingRequest).toMatchObject([
        {
          nickname: newUserTwo.nickname,
          username: newUserTwo.username,
        },
      ]);

      await knex("friends")
        .where("requester_id", newUserTwo.id)
        .andWhere("requestee_id", newUserOne.id)
        .andWhere("status", "Pending")
        .del();
    });

    it("should get 0 pending friend request sent from others", async () => {
      const receivedPendingRequest =
        await usersService.getReceivedFriendRequests(newUserOne.id);
      expect(receivedPendingRequest.length).toBe(0);
    });

    it("successfully add new friends", async () => {
      const result = await usersService.addNewFriends(
        newUserOne.id,
        newUserTwo.username
      );
      expect(result).toMatchObject({
        status: "success",
        message: `Your friend request has sent to ${newUserTwo.username}.`,
      });

      await knex("friends")
        .where("requester_id", newUserOne.id)
        .andWhere("requestee_id", newUserTwo.id)
        .del();
    });

    it("fail to add friend because you two are friends already", async () => {
      await knex
        .insert([
          {
            requester_id: newUserTwo.id,
            requestee_id: newUserOne.id,
            status: "Accept",
          },
        ])
        .into("friends");

      const result = await usersService.addNewFriends(
        newUserOne.id,
        newUserTwo.username
      );
      expect(result).toMatchObject({
        status: "error",
        message: `${newUserTwo.username} is your friend already`,
      });

      await knex("friends")
        .where("requester_id", newUserOne.id)
        .andWhere("requestee_id", newUserTwo.id)
        .del();
    });

    it("fail to add new friends because the username doesn't exist", async () => {
      const result = await usersService.addNewFriends(
        newUserOne.id,
        "notexist_username"
      );
      expect(result).toMatchObject({
        status: "error",
        message: "User does not exist.",
      });
    });

    it("should accept friends request", async () => {
      await knex
        .insert([
          {
            requester_id: newUserTwo.id,
            requestee_id: newUserOne.id,
            status: "Pending",
          },
        ])
        .into("friends");

      await usersService.acceptFriends(newUserOne.id, newUserTwo.username);

      const friendStatus = (
        await knex
          .select("status")
          .from("friends")
          .where("requester_id", newUserTwo.id)
          .andWhere("requestee_id", newUserOne.id)
      )[0].status;

      expect(friendStatus).toBe("Accept");

      await knex("friends")
        .where("requester_id", newUserTwo.id)
        .andWhere("requestee_id", newUserOne.id)
        .del();
    });

    it("should reject friends request", async () => {
      await knex
        .insert([
          {
            requester_id: newUserTwo.id,
            requestee_id: newUserOne.id,
            status: "Pending",
          },
        ])
        .into("friends");

      await usersService.rejectFriends(newUserOne.id, newUserTwo.username);

      const friendStatus = (
        await knex
          .select("status")
          .from("friends")
          .where("requester_id", newUserTwo.id)
          .andWhere("requestee_id", newUserOne.id)
      )[0].status;

      expect(friendStatus).toBe("Reject");

      await knex("friends")
        .where("requester_id", newUserTwo.id)
        .andWhere("requestee_id", newUserOne.id)
        .del();
    });

    afterAll(async () => {
      await knex("friends")
        .where("requester_id", newUserTwo.id)
        .orWhere("requestee_id", newUserTwo.id)
        .del();
      await knex("friends")
        .where("requester_id", newUserOne.id)
        .orWhere("requestee_id", newUserOne.id)
        .del();
      await knex("users").where("id", newUserOne.id).del();
      await knex("users").where("id", newUserTwo.id).del();
    });
  });

  afterAll(async () => {
    await knex.destroy();
  });
});
