import TransactionHistoryModel from '../models/transaction_history.model.js';

import moment from 'moment';

async function GenerateInvoiceNumber() {
  const todayDate = moment.utc().format('DDMMYYYY');
  const findLatestTransactionHistory =
    await TransactionHistoryModel.findOne().sort({ createdAt: -1 });

  let invoiceCode = `INV${todayDate}-001`;

  if (
    findLatestTransactionHistory &&
    findLatestTransactionHistory.invoice_number?.includes(todayDate)
  ) {
    const latestNumberInvoice =
      findLatestTransactionHistory.invoice_number.split('-')[1];
    const incrementedNumber = (parseInt(latestNumberInvoice) + 1)
      .toString()
      .padStart(3, '0');
    invoiceCode = `INV${todayDate}-${incrementedNumber}`;
  }

  return invoiceCode;
}

export { GenerateInvoiceNumber };
