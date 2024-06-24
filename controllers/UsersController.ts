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
    const userList = await this.usersService.getFriendList(userID);
    console.log(userList);
    let uniqueUserList = new Set<number>();

    for (let i in userList) {
      uniqueUserList.add(userList[i].requester_id);
      uniqueUserList.add(userList[i].requestee_id);
    }

    console.log(uniqueUserList);

    const result = await this.usersService.getRank(uniqueUserList);

    console.log(result);
    res.json(result);
  };
}
