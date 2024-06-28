import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("quizzes").del();

  // Inserts seed entries
  await knex("quizzes").insert([
    { quiz: "Quiz 1", description: "A / B / C / D / E / F" },
    { quiz: "Quiz 2", description: "G / H / I / K / L / M" },
    { quiz: "Quiz 3", description: "N / O / P / Q / R / S " },
    { quiz: "Quiz 4", description: "T / U / V / W / X / Y" },
    { quiz: "Quiz 5", description: "All Alphabet" },
  ]);
}
