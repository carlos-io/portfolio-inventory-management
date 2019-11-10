'use strict'
const Database = use('Database')
const escape = use('sqlstring').escape

class BrandController {
    async index({view}) {
        try {
            let brands = await Database.raw(`
                SELECT b.id, b.name, b.image, c.name AS category,
                       CONCAT(u.f_name, ' ', u.l_name) AS user,
                       DATE_FORMAT(b.updated_at, '%a %b %d %Y %h:%i %p') AS updated_at
                FROM inventory.brands b
                INNER JOIN inventory.categories c
                    ON b.categories_id = c.id
                INNER JOIN inventory.users u
                    ON b.users_id = u.id
                ORDER BY b.name, category ASC
            `)
            brands = brands[0]
            return view.render('/admin/brands/all', {brands})
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async store({view, request, response}) {
        try {
            const brand = request.post()
            const image = request.file('image', {
                types: ['image'],
                size: '2mb',
                extnames: ['png', 'jpg', 'jpeg', 'gif']
            })
            const imageName = `${brand.name.replace(/[^-_a-zA-Z0-9.]+/g, '')}.${image.extname}`
            await image.move('public/images/ims/brands', {
                name: imageName,
                overwrite: true
            })
            if (!image.moved()) {
                throw image.error()
            }
            await Database.raw(`
                INSERT INTO inventory.brands (name, image, categories_id, users_id)
                VALUES (
                    ${escape(brand.name)},
                    ${escape('/images/ims/brands/' + imageName)},
                    ${escape(brand.category)},
                    1
                );
            `)
            return response.redirect('/admin/brands')
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async create({view}) {
        try {
            let categories = await Database.raw(`
                SELECT id, name FROM inventory.categories
            `)
            categories = categories[0]
            return view.render('/admin/brands/create', {categories})
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async edit({view, params}) {
        try {
            let brand = await Database.raw(`
                SELECT b.id, b.name, b.image, b.users_id,
                       c.id AS category_id,
                       c.name AS category_name
                FROM inventory.brands b
                INNER JOIN inventory.categories c
                ON b.categories_id = c.id
                WHERE b.id = ${parseInt(params.id)}
            `)
            let categories = await Database.raw(`
                SELECT id, name FROM inventory.categories
            `)
            brand = brand[0][0]
            categories = categories[0]
            return view.render('/admin/brands/edit', {brand, categories})
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async update({view, request, response, params}) {
        try {
            const brand = request.post()
            if (request.file('image')) {
                const image = request.file('image', {
                    types: ['image'],
                    size: '2mb',
                    extnames: ['png', 'jpg', 'jpeg', 'gif']
                })
                const imageName = `${brand.name.replace(/[^-_a-zA-Z0-9.]+/g, '')}.${image.extname}`
                await image.move('public/images/ims/brands', {
                    name: imageName,
                    overwrite: true
                })
                if (!image.moved()) {
                    throw image.error()
                }
                await Database.raw(`
                    UPDATE inventory.brands
                    SET image = ${escape('/images/ims/brands/' + imageName)}
                    WHERE id = ${parseInt(params.id)}
                `)
            }
            await Database.raw(`
                UPDATE inventory.brands
                SET name = ${escape(brand.name)},
                    categories_id = ${parseInt(brand.category)}
                WHERE id = ${parseInt(params.id)}
            `)
            return response.redirect('/admin/brands')
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async delete({view, response, params}) {
        try {
            await Database.raw(`
                DELETE FROM inventory.brands
                WHERE id = ${parseInt(params.id)}
            `)
            return response.redirect('/admin/brands')
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }
}

module.exports = BrandController
