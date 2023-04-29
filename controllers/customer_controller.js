const Customers = require('../db/models/customers');

//@desc  Get all the customers
//@routes get /api/clients
const getCustomers = async ctx => {
    try {
        const foundCustomers = await Customers.query();
        ctx.body = {
            message:'customer Created!',
            data: foundCustomers
        };
        ctx.status = 200;
    } catch (err) {
        ctx.body = err;
        ctx.status = 500;
    }
};

//@desc  Post client 
//@routes post /api/customers
const postCustomers = async (ctx) => {
    try {
        const { name, telephone } = ctx.request.body;
        await Customers.query().insert({
            name: name,
            telephone: telephone
        });
        ctx.body = {
            message:'customer Created!',
            data: {
                name,
                telephone
            }
        }
        ctx.status = 201;
    } catch (err) {
        ctx.status = 500;
        throw (err)
    }
};

module.exports = { getCustomers, postCustomers };