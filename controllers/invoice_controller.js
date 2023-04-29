const Invoices = require('../db/models/invoices');


//@desc  Get all the invoices
//@routes get /api/clients
const getInvoices = async ctx => {
    try {
        const foundInvoices = await Invoices.query();
        ctx.body = {
            message:'invoices!',
            data: foundInvoices
        };
        ctx.status = 200;
    } catch (err) {
        ctx.body = err;
        ctx.status = 500;
    }
};

//@desc  Post client 
//@routes post /api/Invoices
const postInvoices = async (ctx) => {
    try {
        const uniqueId = (length=8) => {
            return parseInt(Math.ceil(Math.random() * Date.now()).toPrecision(length).toString().replace(".", ""))
        }
        const def = uniqueId()
        const { number, customer_name, total_amount } = ctx.request.body;
        await Invoices.query().insert({
            number: def,
            customer_name: customer_name,
            total_amount:total_amount
        });
        ctx.body = {
            message:'invoice Created!',
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

module.exports = { getInvoices, postInvoices };