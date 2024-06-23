import { Knex } from "knex";

export async function seed(knex: Knex): Promise<void> {
  // Deletes ALL existing entries
  await knex("friends").del();

  // Inserts seed entries
  await knex("friends").insert([
    { requester_id: 1, requestee_id: 2, status: "Accept" },
    { requester_id: 1, requestee_id: 3, status: "Accept" },
    { requester_id: 1, requestee_id: 4, status: "Accept" },
    { requester_id: 5, requestee_id: 1, status: "Accept" },
    { requester_id: 6, requestee_id: 1, status: "Accept" },
    { requester_id: 7, requestee_id: 1, status: "Accept" },
    { requester_id: 2, requestee_id: 3, status: "Pending" },
    { requester_id: 2, requestee_id: 4, status: "Pending" },
    { requester_id: 2, requestee_id: 5, status: "Accept" },
    { requester_id: 6, requestee_id: 2, status: "Accept" },
    { requester_id: 3, requestee_id: 4, status: "Reject" },
    { requester_id: 3, requestee_id: 5, status: "Accept" },
    { requester_id: 4, requestee_id: 5, status: "Accept" },
    { requester_id: 5, requestee_id: 6, status: "Accept" },
    { requester_id: 5, requestee_id: 7, status: "Pending" },
    { requester_id: 6, requestee_id: 3, status: "Accept" },
    { requester_id: 6, requestee_id: 4, status: "Pending" },
    { requester_id: 7, requestee_id: 3, status: "Reject" },
    { requester_id: 7, requestee_id: 4, status: "Accept" },
    { requester_id: 7, requestee_id: 2, status: "Accept" },
  ]);
}
