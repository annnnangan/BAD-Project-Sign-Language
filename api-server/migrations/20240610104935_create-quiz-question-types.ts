import type { Knex } from "knex";

const tableName = "quiz_question_types";
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.string("question_type");
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
