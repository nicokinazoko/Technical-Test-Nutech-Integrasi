import express from 'express';
import VerifyJWTToken from '../middleware/authMiddleware.js';
import {
  RegisterMembershipController,
  LoginController,
  GetOneProfileController,
  UpdateMemberController,
  UpdateProfileImageController,
} from '../controllers/membership.controller.js';

const router = express.Router();

import multer from 'multer';

// configure multer to user local storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './uploads'); // Temporary file storage path
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage });

// const upload = multer({ dest: 'uploads/' });

router.post('/registration', RegisterMembershipController);
router.post('/login', LoginController);
router.get('/profile', VerifyJWTToken, GetOneProfileController);
router.put('/profile/update', VerifyJWTToken, UpdateMemberController);
router.put(
  '/profile/image',
  VerifyJWTToken,
  upload.single('file'),
  UpdateProfileImageController
);

export default router;
