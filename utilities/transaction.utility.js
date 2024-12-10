import { db } from '../db/config.js';

import { GetOneUserBasedOnEmail } from '../utilities/user.utitlity.js';

import moment from 'moment';

async function GenerateInvoiceNumber() {
  const todayDate = moment.utc().format('DDMMYYYY');
  const findLatestTransactionHistory =
    await CreateQueryBuilderGetOneTransactionHistoryLatest();

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

async function GenerateAggregateQueryGetAllTransactionHistories({
  collection_name,
  sort,
  pagination,
  email,
}) {
  const collection = db.collection(collection_name);
  const queryMatch = [{ status: 'active' }];

  // Get user data based on email to find the user ID
  const user = await GetOneUserBasedOnEmail({ email });

  // If user exists, add the user ID to the query filter
  if (user?.email) {
    queryMatch.push({ user_id: user._id });
  }

  // Define the aggregation pipeline
  let pipeline = [{ $match: { $and: queryMatch } }];

  if (sort) {
    pipeline.push({ $sort: sort });
  } else {
    pipeline.push({ $sort: { createdAt: -1 } }); // Default sort by createdAt descending
  }

  if (pagination && pagination.limit != null) {
    pipeline.push(
      { $skip: +pagination.offset * +pagination.limit },
      { $limit: +pagination.limit }
    );
  }

  const aggregateQuery = collection.aggregate(pipeline).toArray();

  // Return the aggregation pipeline
  return aggregateQuery;
}

async function CreateQueryBuilderGetOneTransactionHistoryLatest() {
  const collection = db.collection('transaction_histories'); // Access the 'users' collection
  const query = await collection
    .find()
    .sort({ createdAt: -1 })
    .limit(1)
    .toArray();

  return query.length ? query[0] : {};
}

export {
  GenerateInvoiceNumber,
  GenerateAggregateQueryGetAllTransactionHistories,
};
