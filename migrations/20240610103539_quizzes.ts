import type { Knex } from "knex";

const tableName = "quizzes";
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.string("quiz");
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
