'use strict'
const Database = use('Database')
const escape = use('sqlstring').escape

class CategoryController {
    async index({view}) {
        try {
            let categories = await Database.raw(`
                SELECT c.id, c.name,
                       CONCAT(u.f_name, ' ', u.l_name) AS user,
                       DATE_FORMAT(c.updated_at, '%a %b %d %Y %h:%i %p') AS updated_at
                FROM inventory.categories c
                INNER JOIN inventory.users u
                ON c.users_id = u.id
                ORDER BY c.name ASC
            `)
            categories = categories[0]
            return view.render('/admin/categories/all', {categories})
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async store({view, request, response}) {
        try {
            const category = request.post()
            await Database.raw(`
                INSERT INTO inventory.categories (name, users_id)
                VALUES (${escape(category.name)}, 1)
            `)
            return response.redirect('/admin/categories')
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    create({view}) {
        return view.render('/admin/categories/create')
    }

    async edit({view, params}) {
        try {
            let category = await Database.raw(`
                SELECT id, name, users_id
                FROM inventory.categories
                WHERE id = ${parseInt(params.id)}
            `)
            category = category[0][0]
            return view.render('/admin/categories/edit', {category})
        } catch (error) {
            return view.render('/admin/error', {error})
        }

    }

    async update({view, request, response, params}) {
        try {
            const category = request.post()
            await Database.raw(`
                UPDATE inventory.categories
                SET name = ${escape(category.name)}
                WHERE id = ${parseInt(params.id)}
            `)
            return response.redirect('/admin/categories')
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async delete({view, response, params}) {
        try {
            await Database.raw(`
                DELETE FROM inventory.categories
                WHERE id = ${parseInt(params.id)}
            `)
            return response.redirect('/admin/categories')
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }
}

module.exports = CategoryController
