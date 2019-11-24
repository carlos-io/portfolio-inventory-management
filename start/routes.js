'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

Route.get('/', 'PageController.index')

Route.get('/admin', 'Admin/DashboardController.index')

Route.get('/admin/categories', 'Admin/CategoryController.index')
Route.post('/admin/categories', 'Admin/CategoryController.store')
Route.get('/admin/categories/create', 'Admin/CategoryController.create')
Route.get('/admin/categories/:id/edit', 'Admin/CategoryController.edit')
Route.put('/admin/categories/:id/edit', 'Admin/CategoryController.update')
Route.delete('/admin/categories/:id/delete', 'Admin/CategoryController.delete')

Route.get('/admin/brands', 'Admin/BrandController.index')
Route.post('/admin/brands', 'Admin/BrandController.store')
Route.get('/admin/brands/create', 'Admin/BrandController.create')
Route.get('/admin/brands/:id/edit', 'Admin/BrandController.edit')
Route.put('/admin/brands/:id/edit', 'Admin/BrandController.update')
Route.delete('/admin/brands/:id/delete', 'Admin/BrandController.delete')

Route.get('/admin/products', 'Admin/ProductController.index')
Route.post('/admin/products', 'Admin/ProductController.store')
Route.get('/admin/products/create', 'Admin/ProductController.create')
Route.get('/admin/products/:id', 'Admin/ProductController.show')
Route.get('/admin/products/:id/edit', 'Admin/ProductController.edit')
Route.put('/admin/products/:id/edit', 'Admin/ProductController.update')
Route.delete('/admin/products/:id/delete', 'Admin/ProductController.delete')

Route.get('/admin/orders', 'Admin/OrderController.index')
Route.post('/admin/orders', 'Admin/OrderController.store')
Route.get('/admin/orders/create', 'Admin/OrderController.create')
Route.get('/admin/orders/:id', 'Admin/OrderController.show')
Route.get('/admin/orders/:id/edit', 'Admin/OrderController.edit')
Route.put('/admin/orders/:id/edit', 'Admin/OrderController.update')
Route.delete('/admin/orders/:id/delete', 'Admin/OrderController.delete')