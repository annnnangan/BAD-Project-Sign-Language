import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("quiz_choices").del();

  // Inserts seed entries
  await knex("quiz_choices").insert([
    { question_id: 7, choice: "A,B,E,F" },
    { question_id: 8, choice: "E,B,A,D" },
    { question_id: 9, choice: "A,D,F,C" },
    { question_id: 10, choice: "C,A,B,E" },
    { question_id: 17, choice: "G,M,L,I" },
    { question_id: 18, choice: "I,G,H,M" },
    { question_id: 19, choice: "H,K,G,M" },
    { question_id: 20, choice: "K,M,L,G" },
    { question_id: 27, choice: "O,N,Q,R" },
    { question_id: 28, choice: "O,S,R,N" },
    { question_id: 29, choice: "Q,N,S,O" },
    { question_id: 30, choice: "R,Q,P,N" },
    { question_id: 37, choice: "W,T,Y,X" },
    { question_id: 38, choice: "V,T,Y,X" },
    { question_id: 39, choice: "W,V,U,T" },
    { question_id: 40, choice: "X,U,T,Y" },
  ]);
}
