import UserModel from '../models/user.model.js';

async function CheckExistingUser({ email }) {
  if (!email) throw new Error('parameter email is required');

  const checkExistingUser = await UserModel.findOne({
    email: email.trim(),
  }).lean();

  if (checkExistingUser) {
    throw new Error('Email sudah terdaftar, silahkan input email yang lain');
  }

  return checkExistingUser;
}

async function GetOneUserBasedOnEmail({ email }) {
  if (!email) {
    throw new Error('Email is required');
  }
  const user = await UserModel.findOne({ email }).lean();

  return user;
}

export { CheckExistingUser, GetOneUserBasedOnEmail };
