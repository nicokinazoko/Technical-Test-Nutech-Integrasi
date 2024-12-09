import bcrypt from 'bcrypt';

const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const saltRounds = 10;

function CreateSalt() {
  const salt = Math.floor(Math.random() * 1000000000000);

  return salt;
}

async function GenerateHashedPassword(password, salt) {
  let hashedPassword = await bcrypt.hash(password + salt, saltRounds);

  return hashedPassword;
}

async function ValidateEmail({ email }) {
  if (!emailRegex.test(email)) {
    return {
      status: 102,
      message: 'Parameter email tidak sesuai format',
      data: null,
    };
  }
}

async function ValidatePassword({ password }) {
  if (password.length < 8) {
    return {
      status: 102,
      message: 'Parameter password tidak sesuai format',
      data: null,
    };
  }
}

async function ValidateRequiredInput({ value, field_name = 'input' }) {
  if (!value) {
    return {
      status: 102,
      message: `Parameter ${field_name} tidak boleh kosong`,
      data: null,
    };
  }
}

export {
  CreateSalt,
  GenerateHashedPassword,
  ValidateEmail,
  ValidatePassword,
  ValidateRequiredInput,
};
