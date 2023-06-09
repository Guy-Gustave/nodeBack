const Invoices_items = require('../db/models/invoice_items');

//@desc  Get all the Invoices_items
//@routes get /api/clients
const getInvoices_items = async ctx => {
    try {
        const foundInvoices_items = await Invoices_items.query();
        
        ctx.body = {
            message: 'customer Created!',
            data: foundInvoices_items
        };
        ctx.status = 200;
    } catch (err) {
        ctx.body = err;
        ctx.status = 500;
    }
};

// async function getTotalAmountByInvoiceId(invoiceId) {
//     const result = await knex('invoice_items')
//       .select('invoice_id')
//       .sum('total_price as total_amount')
//       .where('invoice_id', invoiceId)
//       .groupBy('invoice_id');
//     return result[0].total_amount;
//   }

//@desc  Post client 
//@routes post /api/Invoices_items
const postInvoices_items = async (ctx) => {
    try {
        const { invoice_id, item_id, quantity, unit_price, total_price } = ctx.request.body;
        await Invoices_items.query().insert({
            invoice_id: invoice_id,
            item_id: item_id,
            quantity: quantity,
            unit_price: unit_price,
            total_price: unit_price * quantity
        });
        ctx.body = {
            message: 'customer Created!',
            data: item_id,
            quantity,
            unit_price,
            total_price
        };
        
        ctx.status = 201;
    } catch (err) {
        ctx.status = 500;
        throw (err)
    }
};

const getInvoiceItemDetails = async ctx => {
    try {
        const invId = ctx.params.id
        console.log('invoiceItem_id', invId)
        const result = await Invoices_items.query()
            .select('Invoices_items.*', )
            .where('invoices_items.id', invId)
            // .first();
            console.log('invoiceItem_id', result)
        // return result;
        ctx.body = {
            message: 'invoice details!',
            data: result

        };
        ctx.status = 200;
    } catch (err) {
        ctx.body = err.message
        ctx.status = 500;

    }
}

const updateInvoiceItem = async (ctx) => {
    try {
        const invoiceItemID = ctx.params.id
        const updatedData = ctx.request.body;
        const result = await Invoices_items.query()
        .where('id', invoiceItemID)
        .update(updatedData);
        
        
    } catch (error) {
        ctx.body = error.message
    }
};

module.exports = { getInvoices_items, postInvoices_items, updateInvoiceItem, getInvoiceItemDetails };