import mongoose from 'mongoose';

import UserModel from '../models/user.model.js';
import {
  CreateSalt,
  GenerateHashedPassword,
  ValidateEmail,
  ValidateInput,
} from '../utilities/common.utility.js';

import { CheckExistingUser } from '../utilities/user.utitlity.js';

async function CreateUser({ email, first_name, last_name, password }) {
  const emailValidation = await ValidateInput({
    field_name: 'email',
    value: email,
  });

  if (emailValidation) return emailValidation;

  const checkExistingUser = await CheckExistingUser(email);

  if (checkExistingUser) return checkExistingUser;

  const firstNameValidation = await ValidateInput({
    field_name: 'first_name',
    value: first_name,
  });

  if (firstNameValidation) return firstNameValidation;

  const lastNameValidation = await ValidateInput({
    field_name: 'last_name',
    value: last_name,
  });

  if (lastNameValidation) return lastNameValidation;

  const passwordValidation = await ValidateInput({
    field_name: 'password',
    value: last_name,
  });

  if (passwordValidation) return passwordValidation;

  const salt = CreateSalt();
  const hashedPassword = await GenerateHashedPassword(password, salt);
  const inputDataUser = {
    email: email ? email.trim().toLowerCase() : '',
    first_name: first_name ? first_name.trim().toLowerCase() : '',
    last_name: last_name ? last_name.trim().toLowerCase() : '',
    salt,
    hashed_password: hashedPassword,
  };

  const newUser = await UserModel.create(inputDataUser);

  return {
    status: 0,
    message: 'Registrasi berhasil silahkan login',
    data: null,
  };
}

export { CreateUser };
