import { GenerateQueryMongoDB } from '../utilities/common.utility.js';

async function GetAllServices() {
  // set parameter query to find
  const parameterQuery = { status: 'active' };

  // execute query
  const services = await GenerateQueryMongoDB({
    collection_name: 'services',
    query: 'find',
    parameter: parameterQuery,
  });

  return {
    status: 0,
    message: 'Sukses',
    data: services.map((service) => {
      return {
        service_code: service?.service_code || '',
        service_name: service?.service_name || '',
        service_icon: service?.service_icon || '',
        service_tariff: service?.service_tariff || 0,
      };
    }),
  };
}

export { GetAllServices };
