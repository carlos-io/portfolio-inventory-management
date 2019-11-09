'use strict'

const Database = use('Database')
const escape = use('sqlstring').escape

class ProductController {
    index({view}) {
        return view.render('admin/products/all')
    }

    store({view, request, response}) {
        return response.redirect('/admin/products')
    }

    create({view}) {
        return view.render('admin/products/create')
    }

    show({view, request, response, params}) {

    }

    edit({view, request, response, params}) {

    }

    edit({view, request, response, params}) {

    }

    delete({view, request, response, params}) {

    }
}

module.exports = ProductController
