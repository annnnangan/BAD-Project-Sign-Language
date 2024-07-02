import { Knex } from "knex";
import { hashPassword } from "../utils/hash";

interface userRegisterInfo {
  nickname: string;
  username: string;
  email: string;
  password: string;
  icon: string;
}

export class UsersService {
  constructor(private knex: Knex) {}

  async getUserByEmail(email: string) {
    return await this.knex.select("*").from("users").where("email", email);
  }

  async getIcons() {
    return await this.knex.select("icon").from("icons");
  }

  async register(userInfo: userRegisterInfo) {
    const emailList = await this.knex.select("email").from("users");
    const usernameList = await this.knex.select("username").from("users");

    const isUsernameRegistered = usernameList.some(
      (user) => user.username === userInfo.username
    );
    const isEmailRegistered = emailList.some(
      (user) => user.email === userInfo.email
    );

    if (isUsernameRegistered && isEmailRegistered) {
      return {
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
      };
    } else if (isUsernameRegistered) {
      return {
        status: "error",
        message: [
          {
            errorFields: "username",
            message: "This username is being registered",
          },
        ],
      };
    } else if (isEmailRegistered) {
      return {
        status: "error",
        message: [
          { errorFields: "email", message: "This email is being registered" },
        ],
      };
    } else {
      const newUserIconID = (
        await this.knex.select("id").from("icons").where("icon", userInfo.icon)
      )[0].id;

      const newUserID: number = (
        await this.knex
          .insert({
            nickname: userInfo.nickname,
            username: userInfo.username,
            email: userInfo.email,
            password: await hashPassword(userInfo.password),
            icon_id: newUserIconID,
          })
          .into("users")
          .returning("users.id")
      )[0].id;

      return {
        status: "success",
        message: "Successfully register",
        users: { username: userInfo.username, userID: newUserID },
      };
    }
  }

  //Profile
  async getUserProfile(userID: number) {
    console.log("service", userID);
    return await this.knex
      .select("users.nickname", "users.username", "icons.icon as icon")
      .from("users")
      .innerJoin("icons", "users.icon_id", "icons.id")
      .where("users.id", userID);
  }

  async getUserCompleteLesson(userID: number) {
    return await this.knex
      .select("user_id")
      .count({ total_complete_lesson: "sign_language_id" })
      .groupBy("user_id")
      .from("complete_learning_list")
      .where("user_id", userID);
  }

  async getUserCompleteQuiz(userID: number) {
    return await this.knex
      .select("user_id")
      .groupBy("user_id")
      .count({ total_complete_quiz: "quiz_id" })
      .from("quiz_scores")
      .where("user_id", userID);
  }

  //Bookmarks
  async getBookmarks(userID: number) {
    return await this.knex
      .select("bookmarks.sign_language_id", "sign_languages.sign_language")
      .from("bookmarks")
      .leftJoin(
        "sign_languages",
        "bookmarks.sign_language_id",
        "sign_languages.id"
      )
      .orderBy("bookmarks.sign_language_id", "asc")
      .where("user_id", userID);
  }

  async removeBookmark(userID: number, signLanguage: string) {
    const signLanguageID = (
      await this.knex
        .select("id")
        .from("sign_languages")
        .where("sign_language", signLanguage)
    )[0].id;

    await this.knex("bookmarks")
      .where("user_id", userID)
      .andWhere("sign_language_id", signLanguageID)
      .del();
  }

  async insertBookmark(userID: number, signLanguage: string) {
    const signLanguageID = (
      await this.knex
        .select("id")
        .from("sign_languages")
        .where("sign_language", signLanguage)
    )[0].id;

    await this.knex
      .insert({
        user_id: userID,
        sign_language_id: signLanguageID,
      })
      .into("bookmarks");
  }

  //Ranking
  async getRank(userID: number) {
    const friendList = await this.knex
      .select("requester_id", "requestee_id", "status")
      .from("friends")
      .where(function () {
        this.where({ requester_id: userID, status: "Accept" }).orWhere({
          requestee_id: userID,
          status: "Accept",
        });
      });

    let uniqueUserList = new Set<number>();

    for (let i in friendList) {
      uniqueUserList.add(friendList[i].requester_id);
      uniqueUserList.add(friendList[i].requestee_id);
    }

    const friendListArray = Array.from(uniqueUserList);
    return await this.knex
      .select(
        "users.id as user_id",
        "users.nickname",
        "users.username",
        "icons.icon"
      )
      .sum({
        total_score: "quiz_scores.highest_score",
      })
      .max({ latest_timestamp: "quiz_scores.updated_at" })
      .from("users")
      .innerJoin("quiz_scores", "users.id", "quiz_scores.user_id")
      .innerJoin("icons", "users.icon_id", "icons.id")
      .groupBy("users.id", "icons.id")
      .whereIn("users.id", friendListArray)
      .orderBy("total_score", "desc")
      .orderBy("latest_timestamp", "asc");
  }

  //Friends
  async getReceivedFriendRequests(userID: number) {
    return await this.knex
      .select("requester_id", "users.nickname", "users.username", "icons.icon")
      .from("friends")
      .innerJoin("users", "friends.requester_id", "users.id")
      .innerJoin("icons", "users.icon_id", "icons.id")
      .where("requestee_id", userID)
      .andWhere("status", "Pending");
  }

  async getSentFriendRequests(userID: number) {
    return await this.knex
      .select(
        "requestee_id",
        "status",
        "users.nickname",
        "users.username",
        "icons.icon"
      )
      .from("friends")
      .innerJoin("users", "friends.requestee_id", "users.id")
      .innerJoin("icons", "users.icon_id", "icons.id")
      .where("requester_id", userID);
  }

  async addNewFriends(userID: number, userName: string) {
    const requesteeID = (
      await this.knex.select("id").from("users").where("username", userName)
    )[0]?.id;

    if (requesteeID) {
      if (requesteeID === userID) {
        return {
          status: "error",
          message: `You cannot add yourself as friend.`,
        };
      } else {
        //check if requester and requestee have any connection already or not
        const isFriend: {
          status: string;
          requester_id: number;
          requestee_id: number;
        } = (
          await this.knex
            .select("requester_id", "requestee_id", "status")
            .from("friends")
            .where(function () {
              this.where({
                requester_id: userID,
                requestee_id: requesteeID,
              }).orWhere({
                requester_id: requesteeID,
                requestee_id: userID,
              });
            })
        )[0];

        if (isFriend?.status === "Accept") {
          return {
            status: "error",
            message: `${userName} are your friend already`,
          };
        } else if (
          isFriend?.status === "Pending" &&
          isFriend?.requester_id === userID &&
          isFriend?.requestee_id === requesteeID
        ) {
          return {
            status: "error",
            message: `Friend request has sent before and is pending ${userName} to accept.`,
          };
        } else if (
          isFriend?.status === "Pending" &&
          isFriend?.requester_id === requesteeID &&
          isFriend?.requestee_id === userID
        ) {
          return {
            status: "error",
            message: "Friend request is pending you to accept.",
          };
        } else if (
          //You sent request to others but other reject you. In this case, you could send again the request.
          isFriend?.status === "Reject" &&
          isFriend?.requester_id === userID &&
          isFriend?.requestee_id === requesteeID
        ) {
          await this.knex("friends")
            .update("status", "Pending")
            .where("requester_id", userID)
            .andWhere("requestee_id", requesteeID);

          return {
            status: "success",
            message: `Your friend request has sent to ${userName}.`,
          };
        } else if (
          //someone sent request to me and I rejected it -> I could still send a new request to that user
          isFriend?.status === "Reject" &&
          isFriend?.requester_id === requesteeID &&
          isFriend?.requestee_id === userID
        ) {
          await this.knex("friends")
            .where("requester_id", requesteeID)
            .andWhere("requestee_id", userID)
            .andWhere("status", "Reject")
            .del();

          await this.knex
            .insert({
              requester_id: userID,
              requestee_id: requesteeID,
              status: "Pending",
            })
            .into("friends");

          return {
            status: "success",
            message: `Your friend request has sent to ${userName}.`,
          };
        } else {
          //if no connection, meaning the users could send friend request
          await this.knex
            .insert({
              requester_id: userID,
              requestee_id: requesteeID,
              status: "Pending",
            })
            .into("friends");
          return {
            status: "success",
            message: `Your friend request has sent to ${userName}.`,
          };
        }
      }
    } else {
      return { status: "error", message: "User does not exist." };
    }
  }

  async acceptFriends(userID: number, userName: string) {
    const requesterID = (
      await this.knex.select("id").from("users").where("username", userName)
    )[0].id;

    await this.knex("friends")
      .update("status", "Accept")
      .where("requester_id", requesterID)
      .andWhere("requestee_id", userID);
  }

  async rejectFriends(userID: number, userName: string) {
    const requesterID = (
      await this.knex.select("id").from("users").where("username", userName)
    )[0].id;

    await this.knex("friends")
      .update("status", "Reject")
      .where("requester_id", requesterID)
      .andWhere("requestee_id", userID);
  }
}
