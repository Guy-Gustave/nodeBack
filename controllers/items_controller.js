const Items = require('../db/models/items')



//@desc  Get all the items
//@routes get /api/clients
const getItems = async ctx => {
    try {
        const foundItems = await Items.query();
        ctx.body = foundItems;
        ctx.status = 200;
    } catch (err) {
        ctx.body = err;
        ctx.status = 500;
    }
};

//@desc  Post client 
//@routes post /api/Items
const postItems = async ctx => {
    try {
        const { item_name, sale_price } = ctx.request.body;
        await Items.query().insert({ 
            item_name: item_name,
            sale_price: sale_price });
        ctx.body = 'items Created!'
        ctx.status = 201;
    } catch (err) {
        ctx.status = 500;
        throw (err)
    }
};

module.exports = { getItems, postItems };