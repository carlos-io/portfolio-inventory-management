'use strict'

class CategoryController {
    index({view}) {
        return view.render('admin/categories/all')
    }

    store({view, request, response}) {
        return response.redirect('/admin/categories')
    }

    create({view}) {
        return view.render('admin/categories/create')
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

module.exports = CategoryController
