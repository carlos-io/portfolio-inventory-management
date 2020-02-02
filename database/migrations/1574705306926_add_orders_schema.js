'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')
const db = process.env.DB_DATABASE

class AddOrdersSchema extends Schema {
  up () {
    this.raw(`
      CREATE TABLE ${db}.orders (
        id INT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
        f_name VARCHAR(60) NOT NULL,
        l_name VARCHAR(60) NOT NULL,
        address VARCHAR(80) NOT NULL,
        address2 VARCHAR(80),
        city VARCHAR(60) NOT NULL,
        state VARCHAR(60) NOT NULL,
        zipcode VARCHAR(20) NOT NULL,
        country VARCHAR(60) NOT NULL,
        payment_type VARCHAR(40) NOT NULL,
        invoice VARCHAR(60) NOT NULL,
        paid_amount FLOAT NOT NULL,
        users_id INT UNSIGNED NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        CONSTRAINT fk_orders_users_id FOREIGN KEY (users_id) REFERENCES users(id) ON DELETE SET NULL
      )
    `)
  }

  down () {
    this.raw(`DROP TABLE ${db}.orders`)
  }
}

module.exports = AddOrdersSchema
