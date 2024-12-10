import jwt from 'jsonwebtoken';

const secretKey = process.env.JWT_SECRET_KEY || 'dJF-YgPY7T4!';

/**
 * Middleware function to verify the JWT token in the request.
 *
 * This function checks for the presence of a JWT token in the `Authorization` header, verifies it using a secret key,
 * and decodes the token to attach the user information to the `req.user` object. If the token is valid, the request proceeds
 * to the next middleware or route handler. If the token is missing, invalid, or expired, it returns a 401 Unauthorized error.
 *
 * @async
 * @function VerifyJWTToken
 * @param {Object} req - The request object containing the headers and any user data if the token is valid.
 * @param {Object} res - The response object used to send the API response.
 * @param {Function} next - The next middleware function in the request-response cycle.
 * @returns {Promise<void>} A promise that resolves when the request continues to the next middleware or handler.
 *
 * @throws {Error} If the token is missing, invalid, or expired, it returns a 401 Unauthorized response.
 */

async function VerifyJWTToken(req, res, next) {
  try {
    // check token is passed
    const token = req.headers['authorization']?.split(' ')[1];

    // verify token
    const decoded = jwt.verify(token, secretKey);

    // set user in request
    req.user = decoded;

    // continue process
    next();
  } catch (error) {
    console.log('Error while verifying ', error);

    // return status 401 if error happened
    res.status(401).json({
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa',
      data: null,
    });
  }
}

export default VerifyJWTToken;
