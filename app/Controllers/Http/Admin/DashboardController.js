'use strict'
const Database = use('Database')
const country = use('countryjs')
const db = process.env.DB_DATABASE

class DashboardController {
    async index({view}) {
        try {
            const sales = (await Database.raw(`
                SELECT DATE_FORMAT(o.created_at, '%m-%d-%Y') AS date,
                       FORMAT(SUM(o.paid_amount), 2) AS total
                FROM ${db}.product_orders po
                INNER JOIN ${db}.orders o
                    ON po.orders_id = o.id
                GROUP BY date
            `))[0]
            const salesAverage = sales.map(o => parseFloat(o.total)).reduce((acc, n) => acc + n) / sales.length
            const products = (await Database.raw(`
                SELECT product,
                SUM(qty) AS total
                FROM ${db}.product_orders
                GROUP BY product, sku
            `))[0]
            const categories = (await Database.raw(`
                SELECT po.sku,
                       SUM(po.qty) AS total,
                       MAX(c.name) AS category
                FROM ${db}.product_orders po
                INNER JOIN ${db}.products p
                    ON po.products_id = p.id
                INNER JOIN ${db}.brands b
                    ON p.brands_id = b.id
                INNER JOIN ${db}.categories c
                    ON b.categories_id = c.id
                GROUP BY po.sku
            `))[0]
            const brands = (await Database.raw(`
                SELECT po.sku,
                       SUM(po.qty) AS total,
                       MAX(b.name) AS brand
                FROM ${db}.product_orders po
                INNER JOIN ${db}.products p
                    ON po.products_id = p.id
                INNER JOIN ${db}.brands b
                    ON p.brands_id = b.id
                GROUP BY po.sku
            `))[0]
            let countryCoords = {}
            country.all()
                .filter(country => country.name)
                .forEach(country => countryCoords[country.name] = country.latlng)
            let countryData = (await Database.raw(`
                SELECT po.product,
                       SUM(po.qty) AS total,
                       o.country
                FROM ${db}.product_orders po
                INNER JOIN ${db}.orders o
                    ON po.orders_id = o.id
                GROUP BY o.country, product
            `))[0]
            let countries = {}
            countryData.forEach(c => {
                if (!countries[c.country]) {
                    countries[c.country] = {
                        latlng: countryCoords[c.country],
                        products: []
                    }
                }
                countries[c.country].products.push({ product: c.product, total: c.total })
            })
            return view.render('/admin/dashboard', {sales, salesAverage, categories, brands, products, countries})
        } catch (error) {
            return view.render('/admin/error', {error})
        }
    }
}

module.exports = DashboardController
