import BannerModel from '../models/banner.model.js';

import mongoose from 'mongoose';

async function GetAllBanners(req, res) {
  const banners = await BannerModel.find().select('-_id').lean();

  return {
    status: 0,
    message: 'Sukses',
    data: banners,
  };
}

export { GetAllBanners };
