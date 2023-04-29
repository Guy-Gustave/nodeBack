const { Model } = require('objection');

class Invoices_items extends Model {
    static get tableName() {
        return 'invoices_items';
    }
    // static relationMappings = {
    //     invoices: {
    //       relation: Model.HasManyRelation,
    //       modelClass: invoices,
    //       join: {
    //         from: 'invoices_items.id',
    //         to: 'invoices.id'
    //       }
    //     }
    //   };
}

module.exports = Invoices_items