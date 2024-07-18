//Configuration
import express from "express";
import fetch from "cross-fetch";
import fs from "fs";
import Knex from "knex";
import { UsersService } from "./services/UsersService";
import { UsersController } from "./controllers/UsersController";
import expressSession from "express-session";
import { getUsersRoutes } from "./routes/usersRoutes";
import { isLoggedIn } from "./utils/guard";
import { GamesService } from "./services/GamesService";
import { GamesController } from "./controllers/GamesController";
import { getGamesRoutes } from "./routes/gamesRoutes";

const knexConfig = require("./knexfile");
const configMode = process.env.NODE_ENV || "development";
export const knex = Knex(knexConfig[configMode]);

export const app = express();

export const usersService = new UsersService(knex);
export const usersController = new UsersController(usersService);
export const gamesService = new GamesService(knex);
export const gamesController = new GamesController(gamesService);

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//set up session
app.use(
  expressSession({
    secret: "wsp",
    resave: true,
    saveUninitialized: true,
  })
);

//session interface
declare module "express-session" {
  export interface SessionData {
    user?: string;
    user_id?: number;
  }
}

app.post("/upload", async (req, res) => {
  const userImage = req.body.imageString;

  // Remove header
  let base64Image = userImage.split(";base64,").pop();
  let timestamp = Date.now();

  fs.writeFile(
    `snapshot/${timestamp}.png`,
    base64Image,
    { encoding: "base64" },
    function (err) {
      if (err) {
        console.error("Error writing file:", err);
      }
      console.log("File created");
    }
  );

  const result = await fetch("http://localhost:8000", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(`${__dirname}/snapshot/${timestamp}.png`),
  });

  const output = await result.json();

  //Delete the image after prediction
  fs.unlink(`snapshot/${timestamp}.png`, (err) => {
    if (err) {
      throw err;
    }

    console.log("Delete File successfully.");
  });
  console.log(output);
  res.json(output);
});

app.use("/users", getUsersRoutes());
app.use("/games", isLoggedIn, getGamesRoutes());

app.use(express.static("public"));
app.use(isLoggedIn, express.static("protected"));

//Port Listener
const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}/`);
});
