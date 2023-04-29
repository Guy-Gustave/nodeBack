/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.up = function (knex) {
    return knex.schema
        .createTable('items', (table) => {
            table.increments();
            table.string('item_name').notNullable();
            table.float('sale_price').notNullable();
            table.timestamps(true, true);
        })
        .createTable('invoices', (table) => {
            table.increments();
            table.integer('number').notNullable();
            table.string('customer_name').notNullable();    
            table.float('total_amount').notNullable();
            // table.date('date').notNullable();
            // table.integer('parent_id').unsigned().references('invoices.id');
            table.timestamps(true, true);
            
        })
        .createTable('invoice_items', (table) => {
            table.increments();
            table.integer('invoice_id').references('id').inTable('invoices');
            table.integer('item_id').references('id').inTable('items');
            table.integer('quantity').notNullable();
            table.float('unit_price').notNullable();
            table.float('total_price').notNullable();
            table.timestamps(true, true);
        })


};

/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> }
 */
exports.down = function (knex) {

};
