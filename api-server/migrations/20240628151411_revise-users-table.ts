import type { Knex } from "knex";

const tableName = "users";
export async function up(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.dropColumn("icon");
    table.integer("icon_id").unsigned();
    table.foreign("icon_id").references("icons.id");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.alterTable(tableName, (table) => {
    table.string("icon");
    table.dropColumn("icon_id");
  });
}
