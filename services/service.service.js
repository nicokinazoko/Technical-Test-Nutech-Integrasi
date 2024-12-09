import mongoose from 'mongoose';

import ServiceModel from '../models/service.model.js';

async function GetAllServices() {
  const services = await ServiceModel.find().select('-_id').lean();

  return {
    status: 0,
    message: 'Sukses',
    data: services,
  };
}

export { GetAllServices };
