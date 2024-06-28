import { Knex } from "knex";

export class UsersService {
  constructor(private knex: Knex) {}
  async getUserByEmail(email: string) {
    return await this.knex.select("*").from("users").where("email", email);
  }

  async getUserProfile(userID: number) {
    return await this.knex
      .select("nickname", "username", "icon")
      .from("users")
      .where("id", userID);
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

  async getBookmarks(userID: number) {
    return await this.knex
      .select("bookmarks.sign_language_id", "sign_languages.sign_language")
      .from("bookmarks")
      .leftJoin(
        "sign_languages",
        "bookmarks.sign_language_id",
        "sign_languages.id"
      )
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

  async getFriendList(userID: number) {
    return await this.knex
      .select("requester_id", "requestee_id", "status")
      .from("friends")
      .where(function () {
        this.where({ requester_id: userID, status: "Accept" }).orWhere({
          requestee_id: userID,
          status: "Accept",
        });
      });
  }

  async getRank(friendList: Set<number>) {
    const friendListArray = Array.from(friendList);
    return await this.knex
      .select(
        "users.id as user_id",
        "users.nickname",
        "users.username",
        "users.icon"
      )
      .sum({
        total_score: "quiz_scores.highest_score",
      })
      .max({ latest_timestamp: "quiz_scores.updated_at" })
      .from("users")
      .innerJoin("quiz_scores", "users.id", "quiz_scores.user_id")
      .groupBy("users.id")
      .whereIn("users.id", friendListArray)
      .orderBy("total_score", "desc")
      .orderBy("latest_timestamp", "asc");
  }

  async getReceivedFriendRequests(userID: number) {
    return await this.knex
      .select("requester_id", "users.nickname", "users.username", "users.icon")
      .from("friends")
      .innerJoin("users", "friends.requester_id", "users.id")
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
        "users.icon"
      )
      .from("friends")
      .innerJoin("users", "friends.requestee_id", "users.id")
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
      }

      const isFriend = (
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

      if (isFriend.status === "Accept") {
        return {
          status: "error",
          message: `${userName} are your friend already`,
        };
      } else if (
        isFriend.status === "Pending" &&
        isFriend.requester_id === userID &&
        isFriend.requestee_id === requesteeID
      ) {
        return {
          status: "error",
          message: `Friend request has sent before and is pending ${userName} to accept.`,
        };
      } else if (
        isFriend.status === "Pending" &&
        isFriend.requester_id === requesteeID &&
        isFriend.requestee_id === userID
      ) {
        return {
          status: "error",
          message: "Friend request is pending you to accept.",
        };
      } else if (
        //You sent request to others but other reject you. In this case, you could send again the request.
        isFriend.status === "Reject" &&
        isFriend.requester_id === userID &&
        isFriend.requestee_id === requesteeID
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
        isFriend.status === "Reject" &&
        isFriend.requester_id === requesteeID &&
        isFriend.requestee_id === userID
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
    } else {
      return { status: "error", message: "User does not exist." };
    }
  }
}
