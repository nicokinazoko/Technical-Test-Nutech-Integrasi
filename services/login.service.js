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

async function Login({ email, password }) {
  const user = await GetOneUserBasedOnEmail({ email });
  if (!user || (user && !user.email)) throw new Error('User is not exist');

  const passwordMatch = await ComparePassword({
    password_input: password,
    user,
  });

  if (!passwordMatch) {
    const error = new Error('Username atau password salah');
    error.status = 401;
    throw error;
  }

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
