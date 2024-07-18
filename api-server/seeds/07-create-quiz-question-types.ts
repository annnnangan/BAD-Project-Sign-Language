import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("quiz_question_types").del();

  // Inserts seed entries
  await knex("quiz_question_types").insert([
    { question_type: "hand_detect" },
    { question_type: "multiple_choices" },
  ]);
}
