import type { Knex } from "knex";

const tableName = "quiz_questions";
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer("quiz_id").unsigned();
    table.foreign("quiz_id").references("quizzes.id");
    table.integer("question_type_id").unsigned();
    table.foreign("question_type_id").references("quiz_question_types.id");
    table.string("question");
    table.string("image");
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
