import { Request, Response } from "express";
import { UsersService } from "../services/UsersService";

class HttpError extends Error {
  public constructor(public code: number, message?: string) {
    super(message);
  }
}

export class UsersController {
  constructor(private usersService: UsersService) {}

  getUsersLogin = async (req: Request, res: Response) => {
    try {
      const userEmail: string = req.body.email;
      const userPassword: string = req.body.password;

      if (!userEmail) {
        throw new HttpError(400, "Email is not Provided");
      }

      if (!userPassword) {
        throw new Error("Password is not Provided");
      }
      const result = await this.usersService.getUsersLogin(
        userEmail,
        userPassword
      );
      if (result.status === "success") {
        // console.log("login success");
        req.session.user = result.message?.username;
        req.session.user_id = result.message?.userID;
        res.status(200).json({ message: "success" });
      } else {
        res.status(401).json({ message: "username/password is incorrect" });
      }
    } catch (e) {
      console.log(e);
      if (e.code) {
        res.status(e.code).json({ message: e.message });
      } else res.status(500).json({ message: "Internal Server Error" });
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
      const result = await this.usersService.getUserProfile(userID);
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
      res.status(200).json({ message: "insert successfully" });
    } catch (e) {
      res.status(500).json({ error: e });
    }
  };

  getRank = async (req: Request, res: Response) => {
    try {
      const userID: number = req.session.user_id as number;
      const result = await this.usersService.getRank(userID);
      res.json(result);
    } catch (e) {
      res.status(500).json({ error: e });
    }
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

      if (result.status === "success") {
        res.status(200).json(result);
      } else if (result.message === "User does not exist.") {
        res.status(404).json(result);
      } else {
        res.status(500).json(result);
      }
    } catch (e) {
      res.status(500).json({ message: "server error" });
    }
  };

  acceptFriends = async (req: Request, res: Response) => {
    try {
      const userID: number = req.session.user_id as number;
      const requesterUsername: string = req.body.requesterUsername;
      const result = await this.usersService.acceptFriends(
        userID,
        requesterUsername
      );

      res.json(result);
    } catch (e) {
      res.status(500).json({ message: "server error" });
    }
  };

  rejectFriends = async (req: Request, res: Response) => {
    try {
      const userID: number = req.session.user_id as number;
      const requesterUsername: string = req.body.requesterUsername;
      const result = await this.usersService.rejectFriends(
        userID,
        requesterUsername
      );

      res.json(result);
    } catch (e) {
      res.status(500).json({ message: "server error" });
    }
  };
}
