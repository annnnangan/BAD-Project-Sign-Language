import { Knex } from "knex";

export class UsersService {
  constructor(private knex: Knex) {}
  async getUserByEmail(email: string) {
    return await this.knex.select("*").from("users").where("email", email);
  }
}
