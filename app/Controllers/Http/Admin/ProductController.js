'use strict'
const Database = use('Database')
const escape = use('sqlstring').escape

class ProductController {
    async index({view}) {
        try {
            let products = await Database.raw(`
                SELECT p.id, p.name, p.image, p.size, p.sku, p.qty,
                       b.name AS brand,
                       c.name AS category,
                       CONCAT(u.f_name, ' ', u.l_name) AS user,
                       DATE_FORMAT(p.updated_at, '%a %b %d %Y %h:%i %p') AS updated_at
                FROM inventory.products p
                INNER JOIN inventory.brands b
                    ON p.brands_id = b.id
                INNER JOIN inventory.categories c
                    ON b.categories_id = c.id
                INNER JOIN inventory.users u
                    ON p.users_id = u.id
                ORDER BY p.name, category ASC
            `)
            products = products[0]
            return view.render('/admin/products/all', {products})
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async store({view, request, response}) {
        try {
            const product = request.post()
            let imageName = null
            if (request.file('image')) {
                const image = request.file('image', {
                    types: ['image'],
                    size: '2mb',
                    extnames: ['png', 'jpg', 'jpeg', 'gif']
                })
                imageName = `${product.name.replace(/[^-_a-zA-Z0-9.]+/g, '')}.${image.extname}`
                await image.move('public/images/ims/products', {
                    name: imageName,
                    overwrite: true
                })
                if (!image.moved()) {
                    throw image.error()
                }
            }
            await Database.raw(`
                INSERT INTO inventory.products (
                    name,
                    ${(product.description) ? 'description,' : ''}
                    ${(imageName) ? 'image,' : ''}
                    sku, material, color, size, qty, brands_id, users_id
                )
                VALUES (
                    ${escape(product.name)},
                    ${(product.description) ? escape(product.description) + ',' : ''}
                    ${(imageName) ? escape('/images/ims/products/' + imageName) + ',' : ''}
                    ${escape(product.sku)},
                    ${escape(product.material)},
                    ${escape(product.color)},
                    ${escape(product.size)},
                    ${escape(product.qty)},
                    ${escape(product.brand_id)},
                    1
                );
            `)
            return response.redirect('/admin/products')
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async create({view}) {
        try {
            let categories_brands = await Database.raw(`
                SELECT c.id AS category_id,
                       c.name AS category_name,
                       b.id AS brand_id,
                       b.name AS brand_name
                FROM inventory.brands b
                INNER JOIN inventory.categories c
                ON b.categories_id = c.id
                ORDER BY category_name, brand_name
            `)
            categories_brands = categories_brands[0]
            return view.render('/admin/products/create', {categories_brands})
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async show({view, params}) {
        try {
            let product = await Database.raw(`
                SELECT id, name, description, image, sku,
                       material, color, size, qty
                FROM inventory.products
                WHERE id = ${parseInt(params.id)}
            `)
            product = product[0][0]
            return view.render('/admin/products/show', {product})
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async edit({view, params}) {
        try {
            let product = await Database.raw(`
                SELECT id, name, description, image, sku,
                       material, color, size, qty, brands_id
                FROM inventory.products
                WHERE id = ${parseInt(params.id)}
            `)
            let categories_brands = await Database.raw(`
                SELECT c.id AS category_id,
                       c.name AS category_name,
                       b.id AS brand_id,
                       b.name AS brand_name
                FROM inventory.brands b
                INNER JOIN inventory.categories c
                    ON b.categories_id = c.id
                ORDER BY category_name, brand_name
            `)
            product = product[0][0]
            categories_brands = categories_brands[0]
            return view.render('/admin/products/edit', {product, categories_brands})
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async update({view, request, response, params}) {
        try {
            const product = request.post()
            let imageName = null
            if (request.file('image')) {
                const image = request.file('image', {
                    types: ['image'],
                    size: '2mb',
                    extnames: ['png', 'jpg', 'jpeg', 'gif']
                })
                imageName = `${product.name.replace(/[^-_a-zA-Z0-9.]+/g, '')}.${image.extname}`
                await image.move('public/images/ims/products', {
                    name: imageName,
                    overwrite: true
                })
                if (!image.moved()) {
                    throw image.error()
                }
            }
            await Database.raw(`
                UPDATE inventory.products
                SET name = ${escape(product.name)},
                    ${(product.description) ? 'description = ' + escape(product.description) + ',' : ''}
                    ${(imageName) ? 'image = ' + escape('/images/ims/products/' + imageName) + ',' : ''}
                    sku = ${escape(product.sku)},
                    material = ${escape(product.material)},
                    color = ${escape(product.color)},
                    size = ${escape(product.size)},
                    qty = ${parseInt(product.qty)},
                    brands_id = ${escape(product.brand_id)}
                WHERE id = ${parseInt(params.id)}
            `)
            return response.redirect('/admin/products')
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async delete({view, response, params}) {
        try {
            await Database.raw(`
                DELETE FROM inventory.products
                WHERE id = ${parseInt(params.id)}
            `)
            return response.redirect('/admin/products')
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }
}

module.exports = ProductController
