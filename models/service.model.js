import mongoose from 'mongoose';

const serviceSchema = mongoose.Schema({
  service_code: {
    type: String,
    required: true,
  },
  service_name: {
    type: String,
    default: '',
  },
  service_icon: {
    type: String,
    default: '',
  },
  service_tariff: {
    type: Number,
    default: 0,
  },
  status: {
    type: String,
    enum: ['active', 'deleted'],
    default: 'active',
  },
});

const serviceModel = mongoose.model('services', serviceSchema);

export default serviceModel;
