import bcrypt from 'bcrypt';

async function ComparePassword({ password_input, user }) {
  if (!password_input) {
    throw new Error('hashed password is not exist');
  }

  if (!user || (user && (!user.hashed_password || !user.salt))) {
    throw new Error('password is not saved in database');
  }

  return await bcrypt.compare(password_input + user.salt, user.hashed_password);
}

export { ComparePassword };
