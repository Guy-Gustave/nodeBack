const dotenv = require('dotenv').config();
const Koa = require('koa');
const koaRoute = require('koa-router');
const json = require('koa-json');
const parser = require('koa-bodyparser');

const dbSetup = require('./db/db-setup');
const customersRoutes = require('./routes/customer_routes')
const itemsRoutes = require('./routes/item_routes');
const invoiceRoutes = require('./routes/invoice_routes.js');
const invoiceItemsRoutes = require('./routes/invoices_items_routes');

const port  = process.env.PORT || 5000

dbSetup();


const app = new Koa();
app.use(parser())
app.use(json());

const router = new koaRoute()

// app.use(async ctx => {
//     ctx.body = 'Hello World';
//   });



// router.post('/customers', (ctx, next) => {
// 	if (
// 		!ctx.request.body.id ||
// 		!ctx.request.body.name ||
// 		!ctx.request.body.telephone 
// 	) {
// 		ctx.response.status = 400;
// 		ctx.body = 'Please enter the data';
// 	} else {
// 		let customer = customers.push({
// 			// id: ctx.request.body.id,
// 			iname: ctx.request.body.iname,
// 			price: ctx.request.body.telephone
// 		});
// 		ctx.response.status = 201;
// 		ctx.body = `New customer added with id: ${ctx.request.body.id} & customer name: ${
// 			ctx.request.body.name
// 		}`;
// 	}
// 	next();
// });
app.use(customersRoutes.routes());
app.use(itemsRoutes.routes());
app.use(invoiceRoutes.routes());
app.use(invoiceItemsRoutes.routes());



app.listen(port, () => console.log(`Server is running on port ${port}`));
