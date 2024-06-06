import { Request, Response } from "express";
import { GamesService } from "../services/GamesService";

export class GamesController {
  constructor(private gamesService: GamesService) {}

  getCompleteList = async (req: Request, res: Response) => {
    const userID = req.session.user_id as number;
    const result = await this.gamesService.getCompleteLanguage(userID);
    res.status(200).json(result);
  };

  updateCompleteLanguage = async (req: Request, res: Response) => {
    const userID = req.session.user_id as number;
    const signLanguage = req.params.index;

    const result = await this.gamesService.completeLanguage(
      userID,
      signLanguage
    );

    res.json(result);
  };
}
