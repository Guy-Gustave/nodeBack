const koaRoute = require('koa-router');
const { getInvoices, postInvoices } = require('../controllers/invoice_controller')

const router = new koaRoute({
    prefix: '/invoices'
});

router.post('/', postInvoices).get('/', getInvoices);

module.exports = router