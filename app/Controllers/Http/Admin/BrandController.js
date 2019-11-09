'use strict'

class BrandController {
    index({view}) {
        return view.render('admin/brands/all')
    }

    store({view, request, response}) {
        return response.redirect('/admin/brands')
    }

    create({view}) {
        return view.render('admin/brands/create')
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

module.exports = BrandController
