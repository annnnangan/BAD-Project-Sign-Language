import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("icons").del();

  // Inserts seed entries
  await knex("icons").insert([
    { icon: "black-shirt-woman.png" },
    { icon: "blue-shirt-man.png" },
    { icon: "blue-shirt-woman-2.png" },
    { icon: "blue-shirt-woman.png" },
    { icon: "green-shirt-man.png" },
    { icon: "grey-shirt-man.png" },
    { icon: "orange-shirt-man.png" },
    { icon: "orange-shirt-woman.png" },
    { icon: "pink-shirt-woman.png" },
    { icon: "purple-shirt-man.png" },
    { icon: "purple-shirt-woman-2.png" },
    { icon: "purple-shirt-woman.png" },
  ]);
}
