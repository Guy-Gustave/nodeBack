const koaRoute = require('koa-router');
const { getInvoices_items, postInvoices_items, updateInvoiceItem, getInvoiceItemDetails } = require('../controllers/invoices_items_controller')

const router = new koaRoute({
    prefix: '/invoices_items'
});

router.post('/', postInvoices_items).get('/', getInvoices_items);
router.put('/:id', updateInvoiceItem).get('/:id', getInvoiceItemDetails);

module.exports = router