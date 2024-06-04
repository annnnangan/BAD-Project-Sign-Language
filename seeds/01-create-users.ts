import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("users").del();

  // Inserts seed entries
  await knex("users").insert([
    {
      nickname: "Anna",
      username: "annangan1234",
      email: "annangan1234@gmail.com",
      password: "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
    },
    {
      nickname: "Amy",
      username: "amy_smile_1",
      email: "amy_smile_1@gmail.com",
      password: "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
    },
    {
      nickname: "John",
      username: "thisis_john",
      email: "thisis_john@gmail.com",
      password: "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
    },
  ]);
}
