'use strict'

class OrderController {
    index({view}) {
        return view.render('admin/orders/all')
    }

    store({view, request, response}) {
        return response.redirect('/admin/orders')
    }

    create({view}) {
        return view.render('admin/orders/create')
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

module.exports = OrderController
