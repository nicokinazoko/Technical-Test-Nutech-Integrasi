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
  return emailRegex.test(email);
}

async function ValidateInput({ value, field_name = 'input' }) {
  if (!value) {
    return {
      status: 102,
      message: `Parameter ${field_name} tidak boleh kosong`,
      data: null,
    };
  } else {
    if (
      (field_name === 'email' && !emailRegex.test(value)) ||
      (field_name === 'password' && value.length < 8)
    ) {
      return {
        status: 102,
        message: `Parameter ${field_name} tidak sesuai format`,
        data: null,
      };
    }
  }
}

export { CreateSalt, GenerateHashedPassword, ValidateEmail, ValidateInput };
