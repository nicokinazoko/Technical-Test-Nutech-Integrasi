import ServiceModel from '../models/service.model.js';

async function GetOneServiceBasedOnServiceCode({ service_code }) {
  const service = await ServiceModel.findOne({ service_code });

  return service;
}

export { GetOneServiceBasedOnServiceCode };
