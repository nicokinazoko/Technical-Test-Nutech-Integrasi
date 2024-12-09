import UserModel from '../models/user.model.js';

async function CheckExistingUser(email) {
  if (!email) throw new Error('parameter email is required');

  const checkExistingUser = await UserModel.findOne({
    email: email.trim(),
  }).select('_id');

  if (checkExistingUser) {
    return {
      status: 102,
      message: `Email sudah terdaftar, silahkan input email yang lain`,
      data: null,
    };
  }

  return checkExistingUser;
}

export { CheckExistingUser };
