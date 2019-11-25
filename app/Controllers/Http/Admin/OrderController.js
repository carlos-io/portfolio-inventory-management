'use strict'
const Database = use('Database')
const escape = use('sqlstring').escape
const country = use('countryjs')

class OrderController {
    async index({view}) {
        try {
            let orders = await Database.raw(`
                SELECT o.id,
                       o.invoice,
                       o.payment_type,
                       FORMAT(o.paid_amount, 2) AS paid_amount,
                       SUM(po.qty) AS items,
                       CONCAT(o.f_name, ' ', o.l_name) AS customer,
                       CONCAT(u.f_name, ' ', u.l_name) AS user,
                       DATE_FORMAT(o.created_at, '%a %b %d %Y %h:%i %p') AS created_at
                FROM inventory.product_orders po
                INNER JOIN inventory.orders o
                    ON po.orders_id = o.id
                INNER JOIN inventory.users u
                    ON o.users_id = u.id
                GROUP BY po.orders_id
                ORDER BY o.created_at DESC
            `)
            orders = orders[0]
            return view.render('/admin/orders/all', {orders})
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async store({request, response}) {
        const form = request.post()
        let lastInsertId = null;
        let productsUpdated = {};
        try {
            const response = await Database.raw(`
                INSERT INTO inventory.orders (
                    f_name,
                    l_name,
                    address,
                    ${(form.address2) ? 'address2,' : ''}
                    city,
                    state,
                    zipcode,
                    country,
                    payment_type,
                    invoice,
                    paid_amount,
                    users_id
                ) VALUES (
                    ${escape(form.f_name)},
                    ${escape(form.l_name)},
                    ${escape(form.address)},
                    ${(form.address2) ? escape(form.address2) + ',' : ''}
                    ${escape(form.city)},
                    ${escape(form.state)},
                    ${escape(form.zipcode)},
                    ${escape(form.country)},
                    ${escape(form.payment_type)},
                    ${escape(form.invoice)},
                    ${escape(form.paid_amount)},
                    1
                );
            `)
            lastInsertId = response[0].insertId;
            for (let product of form.products) {
                await Database.raw(`
                    INSERT INTO inventory.product_orders (
                        products_id,
                        orders_id,
                        brand,
                        product,
                        sku,
                        qty
                    ) VALUES (
                        ${escape(product.id)},
                        ${parseInt(lastInsertId)},
                        ${escape(product.brand)},
                        ${escape(product.name)},
                        ${escape(product.sku)},
                        ${parseInt(product.qty)}
                    )
                `)
                let oldQty = await Database.raw(`
                    SELECT qty FROM inventory.products WHERE id = ${parseInt(product.id)}
                `)
                oldQty = oldQty[0][0].qty
                productsUpdated[product.id] = { oldQty: oldQty }
                await Database.raw(`
                    UPDATE inventory.products
                    SET qty = ${parseInt(oldQty - product.qty)}
                    WHERE id = ${parseInt(product.id)}
                `)
            }
            return {}
        } catch (error) {
            if (lastInsertId) {
                await Database.raw(`
                    DELETE FROM inventory.orders
                    WHERE id = ${parseInt(lastInsertId)}
                `)
                for (let product of form.products) {
                    await Database.raw(`
                        UPDATE inventory.products
                        SET qty = ${parseInt(productsUpdated[product.id].oldQty)}
                        WHERE id = ${parseInt(product.id)}
                    `)
                }
            }
            return response.internalServerError({ message: error.message })
        }
    }

    async create({view}) {
        try {
            let categories_brands_products = await Database.raw(`
                SELECT c.id AS category_id,
                       c.name AS category_name,
                       b.id AS brand_id,
                       b.name AS brand_name,
                       p.id AS product_id,
                       p.name AS product_name,
                       p.image,
                       p.sku,
                       p.material,
                       p.color,
                       p.size,
                       p.qty
                FROM inventory.products p
                INNER JOIN inventory.brands b
                    ON p.brands_id = b.id
                INNER JOIN inventory.categories c
                    ON b.categories_id = c.id
                ORDER BY category_name,
                         brand_name,
                         product_name,
                         p.material,
                         p.color,
                         p.size,
                         p.sku ASC
            `)
            categories_brands_products = categories_brands_products[0]
            const countries_states = country.all()
                .filter(country => country.name)
                .map(country => ({
                    country: country.name,
                    states: country.provinces
                }))
            return view.render('/admin/orders/create', {categories_brands_products, countries_states})
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async show({view, params}) {
        try {
            let order = await Database.raw(`
                SELECT o.id,
                       CONCAT(o.f_name, " ", o.l_name) AS customer,
                       o.address,
                       o.address2,
                       o.city,
                       o.state,
                       o.zipcode,
                       o.country,
                       o.payment_type,
                       o.invoice,
                       FORMAT(o.paid_amount, 2) AS paid_amount,
                       DATE_FORMAT(o.created_at, '%a %m/%d/%Y %h:%i %p') AS created_at,
                       DATE_FORMAT(o.updated_at, '%a %m/%d/%Y %h:%i %p') AS updated_at,
                       CONCAT(u.f_name, " ", u.l_name) AS user
                FROM inventory.orders o
                INNER JOIN inventory.users u
                    ON o.users_id = u.id
                WHERE o.id = ${parseInt(params.id)}
            `)
            order = order[0][0]
            let products = await Database.raw(`
                SELECT po.brand,
                       po.products_id AS id,
                       po.product AS name,
                       p.image,
                       po.sku,
                       p.material,
                       p.color,
                       p.size,
                       po.qty
                FROM inventory.product_orders po
                INNER JOIN inventory.orders o
                    ON po.orders_id = o.id
                LEFT JOIN inventory.products p
                    ON po.products_id = p.id
                WHERE o.id = ${parseInt(params.id)}
                ORDER BY brand,
                         name,
                         color,
                         size,
                         material ASC
            `)
            products = products[0]
            return view.render('/admin/orders/show', {order, products})
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async edit({view, params}) {
        try {
            const countries_states = country.all()
                .filter(country => country.name)
                .map(country => ({
                    country: country.name,
                    states: country.provinces
                }))
            let order = await Database.raw(`
                SELECT id,
                       f_name,
                       l_name,
                       address,
                       address2,
                       city,
                       state,
                       zipcode,
                       country,
                       payment_type,
                       invoice,
                       FORMAT(paid_amount, 2) AS paid_amount
                FROM inventory.orders
                WHERE id = ${parseInt(params.id)}
            `)
            order = order[0][0]
            let products = await Database.raw(`
                SELECT po.brand,
                       po.product AS name,
                       p.image,
                       po.sku,
                       p.material,
                       p.color,
                       p.size,
                       po.qty
                FROM inventory.product_orders po
                INNER JOIN inventory.orders o
                    ON po.orders_id = o.id
                LEFT JOIN inventory.products p
                    ON po.products_id = p.id
                WHERE o.id = ${parseInt(params.id)}
                ORDER BY brand,
                         name,
                         color,
                         size,
                         material ASC
            `)
            products = products[0]
            return view.render('/admin/orders/edit', {order, products, countries_states})
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async update({view, request, response, params}) {
        try {
            const order = request.post()
            await Database.raw(`
                UPDATE inventory.orders
                SET f_name = ${escape(order.f_name)},
                    l_name = ${escape(order.l_name)},
                    address = ${escape(order.address)},
                    address2 = ${(order.address2) ? escape(order.address2) : escape("")},
                    city = ${escape(order.city)},
                    state = ${escape(order.state)},
                    zipcode = ${escape(order.zipcode)},
                    country = ${escape(order.country)},
                    payment_type = ${escape(order.payment_type)},
                    invoice = ${escape(order.invoice)},
                    paid_amount = ${escape(order.paid_amount)}
                WHERE id = ${parseInt(params.id)}
            `)
            return response.redirect('/admin/orders')
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }

    async delete({view, response, params}) {
        try {
            await Database.raw(`
                DELETE FROM inventory.orders
                WHERE id = ${parseInt(params.id)}
            `)
            return response.redirect('/admin/orders')
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }
}

module.exports = OrderController
