'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddBrandsSchema extends Schema {
  up () {
    this.raw(`
      CREATE TABLE inventory.brands (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        image VARCHAR(250),
        categories_id INT UNSIGNED NOT NULL,
        users_id INT UNSIGNED NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_brands_categories_id FOREIGN KEY (categories_id) REFERENCES categories(id) ON DELETE CASCADE,
        CONSTRAINT fk_brands_users_id FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)
  }

  down () {
    this.raw(`DROP TABLE inventory.brands`)
  }
}

module.exports = AddBrandsSchema
