const koaRoute = require('koa-router');
const { getInvoices, postInvoices, getInvoiceDetails, updateInvoice, deleteInvoice } = require('../controllers/invoice_controller')

const router = new koaRoute({
    prefix: '/invoices'
});

router.post('/', postInvoices).get('/', getInvoices);
router.get('/:id', getInvoiceDetails).put('/:id', updateInvoice).delete('/:id', deleteInvoice);

module.exports = router