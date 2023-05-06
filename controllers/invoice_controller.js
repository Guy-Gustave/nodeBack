const Invoices_items = require('../db/models/invoice_items');
const Invoices = require('../db/models/invoices');


//@desc  Get all the invoices
//@routes get /api/clients
// const getInvoices = async ctx => {
//     try {
//         const foundInvoices = await Invoices.query();
//         ctx.body = {
//             message:'invoices!',
//             data: foundInvoices
//         };
//         ctx.status = 200;
//     } catch (err) {
//         ctx.body = err;
//         ctx.status = 500;
//     }
// };


const getInvoices = async ctx => {
    try {
        const foundInvoices_items = await Invoices.query()
            // const result = await knex('invoices')
            .select('invoices.id as invoice_id',
                'invoices.customer_name',
                'items.item_name',
                'invoice_items.unit_price')
            .sum('invoice_items.total_price as total_amount')
            // .join('invoice_items', 'invoices.id', '=', 'invoice_items.invoice_id')
            .join('invoice_items', 'invoices.id', '=', 'invoice_items.invoice_id')
            .join('items', 'invoice_items.item_id', '=', 'items.id')

            // .groupBy('invoices.id');
            .groupBy(
                'invoices.id',
                'invoices.customer_name',
                'items.item_name',
                'invoice_items.unit_price'
            );
        //   return result;

        ctx.body = {
            message: 'Created!',
            data: foundInvoices_items

        };
        ctx.status = 200;
    } catch (err) {
        ctx.body = err;
        ctx.status = 500;
    }
};

let id = null

const getInvoiceDetails = async ctx => {
    try {
        const invoice_id = ctx.params.id
        console.log('invoice_id', invoice_id)
        const result = await Invoices.query()
            .select('invoices.*', 'invoice_items.*', 'items.item_name')
            .join('invoice_items', 'invoices.id', '=', 'invoice_items.invoice_id')
            .join('items', 'invoice_items.item_id', '=', 'items.id')
            .where('invoices.id', invoice_id);
        // return result;
        ctx.body = {
            message: 'invoice details!',
            data: result

        };
        ctx.status = 200;
    } catch (err) {
        ctx.body = err;
        ctx.status = 500;

    }
}

//@desc  Post client 
//@routes post /api/Invoices
const postInvoices = async (ctx) => {
    try {
        const uniqueId = (length = 8) => {
            return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""))
        }
        const def = uniqueId()
        const { number, customer_name, total_amount } = ctx.request.body;
        await Invoices.query().insert({
            number: def,
            customer_name: customer_name,
            total_amount: total_amount
        });
        ctx.body = {
            message: 'invoice Created!',
            data: {
                number,
                customer_name,
                total_amount
            }
        }
        ctx.status = 201;
    } catch (err) {
        ctx.status = 500;
        throw (err)
    }
};

const updateInvoice = async (ctx) => {
    try {
        const invoice_id = ctx.params.id
        console.log('invoice_id', invoice_id);
        const updatedData = ctx.request.body;
        const result = await Invoices.query()
            .where('id', invoice_id)
            .update(updatedData);
        // return result;
        ctx.body = {
            message: 'Invoice updated successfully',
            data: result

        };
        ctx.status = 200;
    } catch (err) {
        ctx.body = { message: 'Error updating invoice' };
        ctx.status = 500;

    }
};

const deleteInvoice = async (ctx) => {
    try {
        const invoice_id = ctx.params.id
        console.log('invoice_id', invoice_id);
        // const updatedData = ctx.request.body;
        const result = await Invoices.query()
            .where('id', invoice_id)
            .del();
        ctx.body = {
            message: 'Invoice deleted successfully',
            data: result

        };
        ctx.status = 200;
    } catch (err) {
        ctx.body = { message: 'Error deleteng invoice' };
        ctx.status = 500;

    }
};



module.exports = { getInvoices, postInvoices, getInvoiceDetails, updateInvoice, deleteInvoice };