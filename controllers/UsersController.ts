import { Request, Response } from "express";
import { UsersService } from "../services/UsersService";
import { checkPassword } from "../utils/hash";

export class UsersController {
  constructor(private usersService: UsersService) {}

  getUsersLogin = async (req: Request, res: Response) => {
    const result = await this.usersService.getUserByEmail(req.body.email);
    if (result) {
      const matched = await checkPassword(
        req.body.password,
        result[0].password
      );
      if (matched) {
        console.log("login success");
        req.session.user = result[0].username;
        req.session.user_id = result[0].id;
        res.status(200).json({ message: "success" });
      } else {
        res.status(401).json({ message: "error" });
      }
    } else {
      res.status(401).json({ message: "error" });
    }
  };

  getIcons = async (req: Request, res: Response) => {
    try {
      const result = await this.usersService.getIcons();
      res.status(200).json(result);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  };

  register = async (req: Request, res: Response) => {
    try {
      const result = await this.usersService.register(req.body);

      console.log(result);

      if (result.status === "success") {
        if (result.users) {
          req.session.user = result.users.username;
          req.session.user_id = result.users.userID;
        }
      }

      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  };

  getUserProfile = async (req: Request, res: Response) => {
    try {
      const userID: number = req.session.user_id as number;
      console.log("session id", userID);
      const result = await this.usersService.getUserProfile(userID);
      console.log("profile result", result);
      res.status(200).json(result);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  };

  getUserCompleteLesson = async (req: Request, res: Response) => {
    try {
      const userID: number = req.session.user_id as number;
      const result = await this.usersService.getUserCompleteLesson(userID);
      res.status(200).json(result);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  };

  getUserCompleteQuiz = async (req: Request, res: Response) => {
    try {
      const userID: number = req.session.user_id as number;
      const result = await this.usersService.getUserCompleteQuiz(userID);
      res.status(200).json(result);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  };

  getBookmarks = async (req: Request, res: Response) => {
    try {
      const userID: number = req.session.user_id as number;

      const result = await this.usersService.getBookmarks(userID);
      res.status(200).json(result);
    } catch (e) {
      res.status(500).json({ error: e });
    }
  };

  removeBookmark = async (req: Request, res: Response) => {
    try {
      const userID: number = req.session.user_id as number;
      const signLanguage = req.params.signLanguage;
      await this.usersService.removeBookmark(userID, signLanguage);
      res.status(200).json({ message: "remove successfully" });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  };

  insertBookmark = async (req: Request, res: Response) => {
    try {
      const userID: number = req.session.user_id as number;
      const signLanguage = req.body.signLanguage;
      await this.usersService.insertBookmark(userID, signLanguage);
      res.status(200).json({ message: "remove successfully" });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  };

  getRank = async (req: Request, res: Response) => {
    const userID: number = req.session.user_id as number;

    const result = await this.usersService.getRank(userID);

    console.log(result);
    res.json(result);
  };

  //Friends

  getReceivedFriendRequests = async (req: Request, res: Response) => {
    const userID: number = req.session.user_id as number;
    const result = await this.usersService.getReceivedFriendRequests(userID);
    res.json(result);
  };

  getSentFriendRequests = async (req: Request, res: Response) => {
    const userID: number = req.session.user_id as number;
    const result = await this.usersService.getSentFriendRequests(userID);

    res.json(result);
  };

  addNewFriends = async (req: Request, res: Response) => {
    try {
      const userID: number = req.session.user_id as number;
      const userName: string = req.body.username;
      const result = await this.usersService.addNewFriends(userID, userName);

      res.json(result);
    } catch (e) {
      res.status(500).json({ message: "server error" });
    }
  };

  acceptFriends = async (req: Request, res: Response) => {
    try {
      const userID: number = req.session.user_id as number;
      const userName: string = req.body.username;
      const result = await this.usersService.acceptFriends(userID, userName);

      res.json(result);
    } catch (e) {
      res.status(500).json({ message: "server error" });
    }
  };

  rejectFriends = async (req: Request, res: Response) => {
    try {
      const userID: number = req.session.user_id as number;
      const userName: string = req.body.username;
      const result = await this.usersService.rejectFriends(userID, userName);

      res.json(result);
    } catch (e) {
      res.status(500).json({ message: "server error" });
    }
  };
}
