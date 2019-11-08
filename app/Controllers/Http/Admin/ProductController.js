'use strict'

const Database = use('Database')
const escape = use('sqlstring').escape

class ProductController {
    index({view}) {
        return view.render('admin/products/all')
    }
}

module.exports = ProductController
