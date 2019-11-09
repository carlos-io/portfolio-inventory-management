'use strict'

class UserController {
    index({view}) {
        return view.render('admin/users/all')
    }

    store({view, request, response}) {
        return response.redirect('/admin/users')
    }

    create({view}) {
        return view.render('admin/users/create')
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

module.exports = UserController
