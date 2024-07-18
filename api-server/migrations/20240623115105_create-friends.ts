import type { Knex } from "knex";

const tableName = "friends";
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer("requester_id").unsigned();
    table.foreign("requester_id").references("users.id");
    table.integer("requestee_id").unsigned();
    table.foreign("requestee_id").references("users.id");
    table.string("status");
    table.timestamps(false, true);
  });

  await knex.raw(`
            CREATE TRIGGER update_timestamp
            BEFORE UPDATE
            ON ${tableName}
            FOR EACH ROW
            EXECUTE PROCEDURE update_timestamp();
          `);
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable(tableName);
}
