'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const db = process.env.DB_DATABASE

class AddProductsSchema extends Schema {
  up () {
    this.raw(`
      CREATE TABLE ${db}.products (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        description VARCHAR(500),
        image VARCHAR(100),
        sku VARCHAR(60) NOT NULL UNIQUE,
        material VARCHAR(40) NOT NULL,
        color VARCHAR(40) NOT NULL,
        size VARCHAR(40) NOT NULL,
        qty INT NOT NULL,
        brands_id INT UNSIGNED NOT NULL,
        users_id INT UNSIGNED NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_products_brands_id FOREIGN KEY (brands_id) REFERENCES brands(id) ON DELETE CASCADE,
        CONSTRAINT fk_products_users_id FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)
  }

  down () {
    this.raw(`DROP TABLE ${db}.products`)
  }
}

module.exports = AddProductsSchema
