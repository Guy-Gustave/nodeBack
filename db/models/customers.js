const { Model } = require('objection');

class Customers extends Model {
    static get tableName() {
        return 'customers';
    }
}

module.exports = Customers