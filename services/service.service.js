import { GenerateQueryMongoDB } from '../utilities/common.utility.js';

/**
 * Retrieves all active services from the database.
 *
 * This function queries the 'services' collection to find all services with a status of 'active'.
 * The services are mapped to include specific fields: `service_code`, `service_name`, `service_icon`, and `service_tariff`.
 *
 * @async
 * @function
 *
 * @returns {Promise<Object>} A promise that resolves to an object containing the status, message, and a list of services.
 *
 * @throws {Error} Throws an error if the query fails or an exception occurs.
 *
 * @example
 * const services = await GetAllServices();
 * console.log(services);
 * // Example response:
 * // {
 * //   status: 0,
 * //   message: 'Sukses',
 * //   data: [
 * //     {
 * //       service_code: 'SV001',
 * //       service_name: 'Premium Package',
 * //       service_icon: 'https://example.com/icon1.png',
 * //       service_tariff: 150000,
 * //     },
 * //     {
 * //       service_code: 'SV002',
 * //       service_name: 'Standard Package',
 * //       service_icon: 'https://example.com/icon2.png',
 * //       service_tariff: 100000,
 * //     },
 * //   ],
 * // }
 */

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
