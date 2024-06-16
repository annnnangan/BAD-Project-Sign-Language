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

  getQuizList = async (req: Request, res: Response) => {
    const result = await this.gamesService.getQuizList();
    res.json(result);
  };

  getQuizQuestion = async (req: Request, res: Response) => {
    const quizID = parseInt(req.query.quiz as string);
    const result = await this.gamesService.getQuizQuestion(quizID);
    res.json(result);
  };

  updateQuizHighestScore = async (req: Request, res: Response) => {
    const userID: number = req.session.user_id as number;
    const quizID: number = parseInt(req.body.quiz as string);
    const score: number = parseInt(req.body.score);

    const result = await this.gamesService.updateQuizHighestScore(
      userID,
      quizID,
      score
    );
    res.json(result);
    console.log(result);
  };
}
