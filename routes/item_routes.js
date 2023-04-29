const koaRoute = require('koa-router');
const { getItems, postItems } = require('../controllers/items_controller')

const router = new koaRoute({
    prefix: '/items'
});

router.post('/', postItems)

router.get('/', getItems );

module.exports = router