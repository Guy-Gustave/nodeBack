const dotenv = require('dotenv').config();
const Koa = require('koa');
const koaRoute = require('koa-router');
const json = require('koa-json');
const parser = require('koa-bodyparser');
const cors = require('@koa/cors');

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

const options = {
    origin: 'http://localhost:4200',
    }
app.use(cors({options}))

const router = new koaRoute()


app.use(customersRoutes.routes());
app.use(itemsRoutes.routes());
app.use(invoiceRoutes.routes());
app.use(invoiceItemsRoutes.routes());



app.listen(port, () => console.log(`Server is running on port ${port}`));
