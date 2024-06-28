import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("sign_language_categories").del();

  // Inserts seed entries
  await knex("sign_language_categories").insert([
    {
      category: "alphabet_group1",
    },
    {
      category: "alphabet_group2",
    },
    {
      category: "alphabet_group3",
    },
    {
      category: "alphabet_group4",
    },
  ]);
}
