import { GenerateQueryMongoDB } from '../utilities/common.utility.js';

async function CheckExistingUser({ email }) {
  if (!email) throw new Error('parameter email is required');

  const parameterQuery = { email: email.trim() };

  const queryBuilder = GenerateQueryMongoDB({
    collection_name: 'users',
    query: 'findOne',
    parameter: parameterQuery,
  });

  const checkExistingUser = await queryBuilder;

  if (checkExistingUser) {
    const error = new Error(
      'Email sudah terdaftar, silahkan input email yang lain'
    );
    error.status = 400;
    throw error;
  }

  return checkExistingUser;
}

async function GetOneUserBasedOnEmail({ email }) {
  if (!email) {
    throw new Error('Email is required');
  }
  const parameterQuery = { email: email.trim() };

  const queryBuilder = GenerateQueryMongoDB({
    collection_name: 'users',
    query: 'findOne',
    parameter: parameterQuery,
  });

  const user = await queryBuilder;
  // const user = await UserModel.findOne({ email }).lean();

  return user;
}

export { CheckExistingUser, GetOneUserBasedOnEmail };
