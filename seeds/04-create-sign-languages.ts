import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("sign_languages").del();

  // Inserts seed entries
  await knex("sign_languages").insert([
    {
      sign_language: "a",
      image: "a-alphabet.png",
      category_id: "1",
    },
    {
      sign_language: "b",
      image: "b-alphabet.png",
      category_id: "1",
    },
    {
      sign_language: "c",
      image: "c-alphabet.png",
      category_id: "1",
    },
    {
      sign_language: "d",
      image: "d-alphabet.png",
      category_id: "1",
    },
    {
      sign_language: "e",
      image: "e-alphabet.png",
      category_id: "1",
    },
    {
      sign_language: "f",
      image: "f-alphabet.png",
      category_id: "1",
    },
    {
      sign_language: "g",
      image: "g-alphabet.png",
      category_id: "2",
    },
    {
      sign_language: "h",
      image: "h-alphabet.png",
      category_id: "2",
    },
    {
      sign_language: "i",
      image: "i-alphabet.png",
      category_id: "2",
    },
    {
      sign_language: "k",
      image: "k-alphabet.png",
      category_id: "2",
    },
    {
      sign_language: "l",
      image: "l-alphabet.png",
      category_id: "2",
    },
    {
      sign_language: "m",
      image: "m-alphabet.png",
      category_id: "2",
    },
    {
      sign_language: "n",
      image: "n-alphabet.png",
      category_id: "3",
    },
    {
      sign_language: "o",
      image: "o-alphabet.png",
      category_id: "3",
    },
    {
      sign_language: "p",
      image: "p-alphabet.png",
      category_id: "3",
    },
    {
      sign_language: "q",
      image: "q-alphabet.png",
      category_id: "3",
    },
    {
      sign_language: "r",
      image: "r-alphabet.png",
      category_id: "3",
    },
    {
      sign_language: "s",
      image: "s-alphabet.png",
      category_id: "3",
    },
    {
      sign_language: "t",
      image: "t-alphabet.png",
      category_id: "4",
    },
    {
      sign_language: "u",
      image: "u-alphabet.png",
      category_id: "4",
    },
    {
      sign_language: "v",
      image: "v-alphabet.png",
      category_id: "4",
    },
    {
      sign_language: "w",
      image: "w-alphabet.png",
      category_id: "4",
    },
    {
      sign_language: "x",
      image: "x-alphabet.png",
      category_id: "4",
    },
    {
      sign_language: "y",
      image: "y-alphabet.png",
      category_id: "4",
    },
  ]);
}
