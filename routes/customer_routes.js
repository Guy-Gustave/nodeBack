const koaRoute = require('koa-router');
const { getCustomers, postCustomers } = require('../controllers/customer_controller')

const router = new koaRoute({
    prefix: '/customers'
});

router.post('/', postCustomers).get('/', getCustomers);

// let customers = [
//     { id: 1, name: 'Quartz Analog Wrist Watch', telephone: '1234567' },
//     { id: 2, name: 'Leather Peep Pump Heels', telephone: 'U1234567' },
//     { id: 3, name: 'Apple iPod', telephone: 'US1234567' }
// ];
module.exports = router