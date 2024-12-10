import { CreateUser } from '../services/user.service.js';

import {
  ValidateEmail,
  ValidatePassword,
  ValidateRequiredInput,
} from '../utilities/common.utility.js';

import {
  CheckExistingUser,
  GetOneUserBasedOnEmail,
} from '../utilities/user.utitlity.js';

async function RegisterMembershipController(req, res) {
  try {
    // get data from body
    const { email, first_name, last_name, password } = req.body;

    // section validate input
    await ValidateEmail({
      email,
    });

    await CheckExistingUser({ email });

    await ValidateRequiredInput({
      field_name: 'first_name',
      value: first_name,
    });

    await ValidateRequiredInput({
      field_name: 'last_name',
      value: last_name,
    });

    await ValidatePassword({
      password,
    });

    // end section validate input

    // call function to create user
    const resultCreateUser = await CreateUser({
      email,
      first_name,
      last_name,
      password,
    });

    return res.status(200).json(resultCreateUser);
  } catch (error) {
    // log the error
    console.error('Error in RegisterMembershipController:', error);

    // return error to api
    res.status(500).json({
      status: 102,
      message: error.message,
      data: null,
    });
  }
}

export { RegisterMembershipController };
