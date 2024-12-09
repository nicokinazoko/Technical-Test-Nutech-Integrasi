import mongoose from 'mongoose';

import UserModel from '../models/user.model.js';
import {
  CreateSalt,
  GenerateHashedPassword,
  ValidateEmail,
  ValidatePassword,
  ValidateRequiredInput,
} from '../utilities/common.utility.js';

import { CheckExistingUser } from '../utilities/user.utitlity.js';

async function CreateUser({ email, first_name, last_name, password }) {
  const emailValidation = await ValidateEmail({
    email,
  });

  if (emailValidation) return emailValidation;

  const checkExistingUser = await CheckExistingUser(email);

  if (checkExistingUser) return checkExistingUser;

  const firstNameValidation = await ValidateRequiredInput({
    field_name: 'first_name',
    value: first_name,
  });

  if (firstNameValidation) return firstNameValidation;

  const lastNameValidation = await ValidateRequiredInput({
    field_name: 'last_name',
    value: last_name,
  });

  if (lastNameValidation) return lastNameValidation;

  const passwordValidation = await ValidatePassword({
    password,
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

  await UserModel.create(inputDataUser);

  return {
    status: 0,
    message: 'Registrasi berhasil silahkan login',
    data: null,
  };
}

export { CreateUser };
