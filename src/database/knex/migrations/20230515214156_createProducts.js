exports.up = (knex) =>
  knex.schema.createTable("products", (table) => {
    table.increments("id");
    table.text("name");
    table.text("description");
    table.text("category");
    table.integer("price").notNullable();
    table.specificType("ingredients", "text ARRAY").notNullable().default([]);
    table.string("avatar");
    table
      .integer("user_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    table.timestamp("created_at").default(knex.fn.now());
    table.timestamp("updated_at").default(knex.fn.now());
  });

exports.down = (knex) => knex.schema.dropTable("products");
