const { transaction } = require("objection");
const Invoices_items = require("../db/models/invoice_items");
const Invoices = require("../db/models/invoices");
const Items = require("../db/models/items");

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

const getInvoices = async (ctx) => {
  try {
    const foundInvoices_items = await Invoices.query();
    // const result = await knex('invoices')
    //   return result;

    ctx.body = {
      message: "Created!",
      data: foundInvoices_items,
    };
    ctx.status = 200;
  } catch (err) {
    ctx.body = err;
    ctx.status = 500;
  }
};

let id = null;

const getInvoiceDetails = async (ctx) => {
  try {
    const invoice_id = ctx.params.id;
    console.log("invoice_id", invoice_id);
    const result = await Invoices.query()
      .select("invoices.*", "invoice_items.*", "items.item_name")
      .join("invoice_items", "invoices.id", "=", "invoice_items.invoice_id")
      .join("items", "invoice_items.item_id", "=", "items.id")
      .where("invoices.id", invoice_id);
    // return result;
    ctx.body = {
      message: "invoice details!",
      data: result,
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
  const { customer_name, number, items } = ctx.request.body;
  const uniqueId = (length = 8) => {
    return parseInt(
      Math.ceil(Math.random() * Date.now())
        .toPrecision(length)
        .toString()
        .replace(".", "")
    );
  };
  const def = uniqueId();

  try {
    await transaction(Invoices.knex(), async (trx) => {
      const invoice = await Invoices.query(trx).insert({
        customer_name,
        number: def,
        total_amount: 0,
      });

      for (const item of items) {
        const { item_id, quantity } = item;
        // Get the item
        const dbItem = await Items.query(trx).findById(item_id);

        if (!dbItem) {
          throw new Error(`Item with id ${item_id} not found`);
        }
        // Calculate the total price for this item
        const unit_price = dbItem.sale_price;
        const total_price = unit_price * quantity;

        // Create the invoice item
        await Invoices_items.query(trx).insert({
          invoice_id: invoice.id,
          item_id,
          quantity,
          unit_price,
          total_price,
        });

        invoice.total_amount += total_price;
        await invoice.$query(trx).patch({ total_amount: invoice.total_amount });

        // await Items.query(trx)
        //   .findById(item_id)
        //   .patch({ quantity: dbItem.quantity - quantity });
      }
    });

    ctx.status = 201;
    ctx.body = { message: "Invoice created successfully" };
  } catch (error) {
    console.error(error);
    console.error(ctx.request.body);
    ctx.status = 500;
    ctx.body = { message: "Internal server error" };
  }
};

const updateInvoice = async (ctx) => {
  try {
    // Start a transaction
    await transaction(Invoices.knex(), async (trx) => {
      const id = ctx.params.id;
      const { customer_name, items } = ctx.request.body;
      // Get the invoice
      const invoice = await Invoices.query(trx).findById(id);

      // Delete all existing invoice_items for this invoice
      await Invoices_items.query(trx).delete().where("invoice_id", id);

      // Loop through the items and create invoice_items
      for (const item of items) {
        const { item_id, quantity } = item;

        // Get the item
        const dbItem = await Items.query(trx).findById(item_id);

        // Calculate the total price
        const total_price = dbItem.sale_price * quantity;

        // Create the invoice_item
        await Invoices_items.query(trx).insert({
          invoice_id: invoice.id,
          item_id,
          quantity,
          unit_price: dbItem.sale_price,
          total_price,
        });

        // Update the total amount of the invoice
        invoice.total_amount += total_price;
      }

      // Update the invoice with the new details
      await invoice
        .$query(trx)
        .patch({ customer_name, total_amount: invoice.total_amount });
    });
    ctx.status = 200;
    ctx.body = {
      message: "Invoice updated successfully",
      //   data: result,
    };
  } catch (err) {
    console.log("====>err", err);
    ctx.body = { message: "Error updating invoice, try again" };
    ctx.status = 500;
  }
};

const deleteInvoice = async (ctx) => {
  try {
    await transaction(Invoices.knex(), async (trx) => {
      const id = ctx.params.id;
      console.log("invoice_id", id);
      // Delete all invoice_items for this invoice
      await Invoices_items.query(trx).delete().where("invoice_id", id);
      // Delete the invoice
      await Invoices.query(trx).deleteById(id);
    });

    ctx.status = 200;
    ctx.body = {
      message: "Invoice deleted successfully",
      // data: result,
    };
  } catch (err) {
    console.log("errrrrr", err);
    ctx.body = { message: "Error deleteng invoice" };
    ctx.status = 500;
  }
};

const splitInvoice = async (ctx) => {
  const id = ctx.params.id;
  const { clients } = ctx.request.body;

  try {
    // Start a transaction
    await transaction(Invoices.knex(), async (trx) => {
      // Get the original invoice
      const originalInvoice = await Invoices.query(trx).findById(id);

      // Delete all existing invoice_items for this invoice
      // await Invoices_items.query(trx).delete().where("invoice_id", id);

      // Loop through the clients and create new invoices
      const newInvoices = [];
      for (const client of clients) {
        const { customer_name, items } = client;

        const uniqueId = (length = 8) => {
          return parseInt(
            Math.ceil(Math.random() * Date.now())
              .toPrecision(length)
              .toString()
              .replace(".", "")
          );
        };
        const def = uniqueId();

        // Create the new invoice
        const newInvoice = await Invoices.query(trx).insert({
          customer_name,
          number: def,
          total_amount: 0,
        });

        // Loop through the items and create invoice_items for the new invoice
        for (const item of items) {
          const { item_id, quantity } = item;

          // Get the item
          const dbItem = await Items.query(trx).findById(item_id);

          // Calculate the total price
          if (!dbItem) {
            throw new Error(`Item with id ${item_id} not found`);
          }
          // Calculate the total price for this item
          const unit_price = dbItem.sale_price;
          const total_price = unit_price * quantity;
          console.log('total_price: ', total_price);

          // Create the invoice_item for the new invoice
          await Invoices_items.query(trx).insert({
            invoice_id: newInvoice.id,
            item_id,
            quantity,
            unit_price: dbItem.sale_price,
            total_price,
          });

          // Update the total amount of the new invoice
          newInvoice.total_amount += total_price;
        }

        // Update the total amount of the original invoice
        originalInvoice.total_amount -= newInvoice.total_amount;

        // Update the original invoice with the new total amount
        await originalInvoice.$query(trx).patch({ total_amount: originalInvoice.total_amount });

        // Add the new invoice to the response
        newInvoices.push(newInvoice);
      }

      ctx.status = 200;
      ctx.body = { message: 'Invoice split successfully', invoices: newInvoices };
    });
  } catch (error) {
    console.error(error);
    ctx.status = 500;
    ctx.body = { message: 'Internal server error' };
  }
};

module.exports = {
  getInvoices,
  postInvoices,
  getInvoiceDetails,
  updateInvoice,
  deleteInvoice,
  splitInvoice,
};
