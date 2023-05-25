const koaRoute = require('koa-router');
const { getInvoices, postInvoices, getInvoiceDetails, updateInvoice, deleteInvoice, splitInvoice } = require('../controllers/invoice_controller')

const router = new koaRoute({
    prefix: '/invoices'
});

router.post('/', postInvoices).get('/', getInvoices);
router.get('/:id', getInvoiceDetails).put('/:id', updateInvoice).delete('/:id', deleteInvoice);
router.post('/split/:id', splitInvoice)

module.exports = router