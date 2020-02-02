'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const db = process.env.DB_DATABASE

class AddProductOrdersSchema extends Schema {
  up () {
    this.raw(`
      CREATE TABLE ${db}.product_orders (
        products_id INT UNSIGNED NULL,
        orders_id INT UNSIGNED NOT NULL,
        CONSTRAINT productorders_key UNIQUE (products_id, orders_id),
        brand VARCHAR(60) NOT NULL,
        product VARCHAR(60) NOT NULL,
        sku VARCHAR(60) NOT NULL,
        qty INT UNSIGNED NOT NULL,
        CONSTRAINT fk_productorders_products_id FOREIGN KEY (products_id) REFERENCES products(id) ON DELETE SET NULL,
        CONSTRAINT fk_productorders_orders_id FOREIGN KEY (orders_id) REFERENCES orders(id) ON DELETE CASCADE
      )
    `)
  }

  down () {
    this.raw(`DROP TABLE ${db}.product_orders`)
  }
}

module.exports = AddProductOrdersSchema
