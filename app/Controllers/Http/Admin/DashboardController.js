'use strict'

class DashboardController {
    index({view}) {
        return view.render('admin/dashboard')
    }
}

module.exports = DashboardController
