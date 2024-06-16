import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("quiz_scores").del();

  // Inserts seed entries
  await knex("quiz_scores").insert([
    { user_id: 1, quiz_id: 1, highest_score: 1 },
    { user_id: 1, quiz_id: 2, highest_score: 2 },
    { user_id: 2, quiz_id: 1, highest_score: 2 },
    { user_id: 3, quiz_id: 4, highest_score: 1 },
  ]);
}
