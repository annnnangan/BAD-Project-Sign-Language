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
}
