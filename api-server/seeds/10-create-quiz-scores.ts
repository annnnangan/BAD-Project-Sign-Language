import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("quiz_scores").del();

  // Inserts seed entries
  await knex("quiz_scores").insert([
    {
      user_id: 1,
      quiz_id: 1,
      highest_score: 1,
      created_at: "2024-06-23 22:09:46",
      updated_at: "2024-06-23 22:09:46",
    },
    {
      user_id: 1,
      quiz_id: 2,
      highest_score: 2,
      created_at: "2024-06-23 22:09:46",
      updated_at: "2024-06-23 22:09:46",
    },
    {
      user_id: 1,
      quiz_id: 3,
      highest_score: 3,
      created_at: "2024-06-23 22:09:46",
      updated_at: "2024-06-23 22:09:46",
    },
    {
      user_id: 2,
      quiz_id: 1,
      highest_score: 2,
      created_at: "2024-06-23 22:09:46",
      updated_at: "2024-06-23 22:09:46",
    },
    {
      user_id: 2,
      quiz_id: 4,
      highest_score: 1,
      created_at: "2024-06-23 22:09:46",
      updated_at: "2024-06-23 22:09:46",
    },
    {
      user_id: 2,
      quiz_id: 3,
      highest_score: 2,
      created_at: "2024-06-23 22:09:46",
      updated_at: "2024-06-23 22:09:46",
    },
    {
      user_id: 3,
      quiz_id: 4,
      highest_score: 4,
      created_at: "2024-06-23 22:09:46",
      updated_at: "2024-06-23 22:09:46",
    },
    {
      user_id: 4,
      quiz_id: 5,
      highest_score: 2,
      created_at: "2024-06-23 22:09:46",
      updated_at: "2024-06-23 22:09:46",
    },
    {
      user_id: 4,
      quiz_id: 3,
      highest_score: 1,
      created_at: "2024-06-23 22:09:46",
      updated_at: "2024-06-23 22:09:46",
    },
    {
      user_id: 5,
      quiz_id: 2,
      highest_score: 1,
      created_at: "2024-06-23 22:09:46",
      updated_at: "2024-06-23 22:09:46",
    },
    {
      user_id: 5,
      quiz_id: 1,
      highest_score: 1,
      created_at: "2024-06-23 22:09:46",
      updated_at: "2024-06-23 22:09:46",
    },
    {
      user_id: 6,
      quiz_id: 3,
      highest_score: 2,
      created_at: "2024-06-24 22:09:46",
      updated_at: "2024-06-24 22:09:46",
    },
    {
      user_id: 7,
      quiz_id: 2,
      highest_score: 1,
      created_at: "2024-06-23 22:09:46",
      updated_at: "2024-06-23 22:09:46",
    },
  ]);
}
