const { Model } = require('objection');

class Invoices extends Model {
    static get tableName() {
        return 'invoices';
    }
    static get relationMappings() {
        const Invoices_items = require('./invoice_items');
        const Items = require('./items');
        return {
            invoices_items: {
                relation: Model.HasManyRelation,
                modelClass: Invoices_items,
                join: {
                    from: 'invoices.id',
                    to: 'invoices_items.id'
                }
            },
            items: {
                relation: Model.HasManyRelation,
                modelClass: Items,
                join: {
                    from: 'invoices.id',
                    to: 'items.id'
                }
            }
        }
    };
}

module.exports = Invoices