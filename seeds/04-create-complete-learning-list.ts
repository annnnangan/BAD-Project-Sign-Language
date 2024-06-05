import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("complete_learning_list").del();

  // Inserts seed entries
  await knex("complete_learning_list").insert([
    {
      user_id: 1,
      sign_language_id: 1,
    },
    {
      user_id: 1,
      sign_language_id: 2,
    },
    {
      user_id: 1,
      sign_language_id: 23,
    },
    {
      user_id: 1,
      sign_language_id: 18,
    },
    {
      user_id: 2,
      sign_language_id: 1,
    },
    {
      user_id: 2,
      sign_language_id: 4,
    },
    {
      user_id: 2,
      sign_language_id: 15,
    },
    {
      user_id: 3,
      sign_language_id: 3,
    },
    {
      user_id: 3,
      sign_language_id: 4,
    },
    {
      user_id: 3,
      sign_language_id: 5,
    },
  ]);
}
