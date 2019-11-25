'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class AddUsersSchema extends Schema {
  up () {
    this.raw(`
      CREATE TABLE inventory.users (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        f_name VARCHAR(60) NOT NULL,
        l_name VARCHAR(60) NOT NULL,
        email VARCHAR(200) NOT NULL,
        username VARCHAR(60) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      )
    `)

    this.raw(`
      INSERT INTO inventory.users (f_name, l_name, email, username)
      VALUES ('John', 'Doe', 'john.doe@gmail.com', 'jdoe')
    `)
  }

  down () {
    this.raw(`DROP TABLE inventory.users`)
  }
}

module.exports = AddUsersSchema
