const secretKey = process.env.JWT_SECRET_KEY || 'dJF-YgPY7T4!';

async function VerifyJWTToken(req, res, next) {
  const token = req.headers['authorization']?.split(' ')[1];

  if (!token) {
    res.json({
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa',
      data: null,
    });
    return {
      status: 108,
      message: 'Token tidak tidak valid atau kadaluwarsa',
      data: null,
    };
  }

  next();
}

export default VerifyJWTToken;
