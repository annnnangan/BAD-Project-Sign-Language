import type { Knex } from "knex";

const tableName = "bookmarks";
export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable(tableName, (table) => {
    table.increments();
    table.integer("user_id").unsigned();
    table.foreign("user_id").references("users.id");
    table.integer("sign_language_id").unsigned();
    table.foreign("sign_language_id").references("sign_languages.id");
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
