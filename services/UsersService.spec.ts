import { UsersService } from "./UsersService";

import Knex from "knex";
const knexConfig = require("../knexfile");
const knex = Knex(knexConfig["development"]);

describe("UsersService", () => {
  let usersService: UsersService;
  let userID: number;
  beforeEach(async () => {
    usersService = new UsersService(knex);
    userID = (
      await knex
        .insert([
          {
            nickname: "Ken",
            username: "ken_ken",
            email: "ken_lee@gamil.com",
            password:
              "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
          },
        ])
        .into("users")
        .returning("id")
    )[0].id;
  });

  it("should get user", async () => {
    const userEmail = "ken_lee@gamil.com";
    const user = await usersService.getUserByEmail(userEmail);

    expect(user).toMatchObject([
      {
        nickname: "Ken",
        username: "ken_ken",
        email: "ken_lee@gamil.com",
        password:
          "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
      },
    ]);
  });

  it("should not get user", async () => {
    const userEmail = "jane_doe@gamil.com";
    const user = await usersService.getUserByEmail(userEmail);

    expect(user).toEqual([]);
  });
  //each time when we run, we should delete the testing data we just insert, otherwise there will be tons of data
  afterEach(async () => {
    await knex("users").where("id", userID).del();
  });

  //stop the knex connection after running all the test case
  afterAll(async () => {
    await knex.destroy();
  });
});
