import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
const secretKey = process.env.JWT_SECRET_KEY || 'dJF-YgPY7T4!';

async function ComparePassword({ password_input, user }) {
  if (!password_input) {
    throw new Error('password input is required');
  }

  if (!user || (user && (!user.hashed_password || !user.salt))) {
    throw new Error('hashed password is not exist');
  }

  return await bcrypt.compare(password_input + user.salt, user.hashed_password);
}

async function GetToken({ tokenData, timeExpired }) {
  if (!tokenData || !timeExpired) {
    throw new Error('Paramater get token is missing');
  }

  const token = jwt.sign(tokenData, secretKey, { expiresIn: timeExpired });

  return token;
}

async function GetEmailFromToken({ tokenData }) {
  if (!tokenData) {
    throw new Error('Paramater get email is missing');
  }

  const tokenDecode = jwt.verify(tokenData, secretKey);

  return tokenDecode.email;
}

export { ComparePassword, GetToken, GetEmailFromToken };
