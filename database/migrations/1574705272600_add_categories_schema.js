'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddCategoriesSchema extends Schema {
  up () {
    this.raw(`
      CREATE TABLE inventory.categories (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(60) NOT NULL,
        users_id INT UNSIGNED NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_categories_users_id FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)
  }

  down () {
    this.raw(`DROP TABLE inventory.categories`)
  }
}

module.exports = AddCategoriesSchema
