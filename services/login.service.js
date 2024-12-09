import {
  ValidateEmail,
  ValidatePassword,
} from '../utilities/common.utility.js';

import {
  ComparePassword,
  GetToken,
  GetEmailFromToken,
} from '../utilities/login.utility.js';

import {
  CheckExistingUser,
  GetOneUserBasedOnEmail,
} from '../utilities/user.utitlity.js';

async function Login(email, password) {
  const emailValidation = await ValidateEmail({
    email,
  });

  if (emailValidation) return emailValidation;

  const passwordValidation = await ValidatePassword({
    password,
  });

  if (passwordValidation) return passwordValidation;

  const checkExistingUser = await CheckExistingUser(email);

  if (!checkExistingUser) {
    throw new Error('Email not exist');
  }

  const user = await GetOneUserBasedOnEmail({ email });
  if (!user || (user && !user.email)) throw new Error('User is not exist');

  const passwordMatch = await ComparePassword({
    password_input: password,
    user,
  });

  if (!passwordMatch)
    return {
      status: 103,
      message: 'Username atau password salah',
      data: null,
    };

  const tokenData = {
    email: user.email,
  };

  const token = await GetToken({ tokenData, timeExpired: '12h' });

  return {
    status: 0,
    message: 'Login Sukses',
    data: {
      token,
    },
  };
}

export { Login };
