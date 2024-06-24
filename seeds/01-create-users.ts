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
      icon: "blue-shirt-woman.png",
    },
    {
      nickname: "Amy",
      username: "amy_smile_1",
      email: "amy_smile_1@gmail.com",
      password: "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
      icon: "pink-shirt-woman.png",
    },
    {
      nickname: "John",
      username: "thisis_john",
      email: "thisis_john@gmail.com",
      password: "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
      icon: "grey-shirt-man.png",
    },
    {
      nickname: "Ken",
      username: "kennnn",
      email: "kennnn@gmail.com",
      password: "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
      icon: "orange-shirt-man.png",
    },
    {
      nickname: "Anson",
      username: "anson-ma12",
      email: "anson-ma12@gmail.com",
      password: "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
      icon: "green-shirt-man.png",
    },
    {
      nickname: "Mary",
      username: "mary_chan234",
      email: "mary_chan234@gmail.com",
      password: "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
      icon: "purple-shirt-woman.png",
    },
    {
      nickname: "Emma",
      username: "emmma0504",
      email: "emmma0504@gmail.com",
      password: "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
      icon: "purple-shirt-woman.png",
    },
    {
      nickname: "jane",
      username: "JaneDoe",
      email: "Janedoe2@gmail.com",
      password: "$2a$10$ZjJdxQ2xQIiKGjiBeXoUzuogZa/e9okqd0pzFxEPHUhpg1aEaV3JW",
      icon: "pink-shirt-woman.png",
    },
  ]);
}
