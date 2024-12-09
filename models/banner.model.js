import mongoose from 'mongoose';

const bannerSchema = mongoose.Schema(
  {
    banner_name: {
      type: String,
      required: true,
    },
    banner_image: {
      type: String,
      default: '',
    },
    description: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['active', 'deleted'],
      default: 'active',
    },
  },
  {
    timestamps: true,
  }
);

const bannerModel = mongoose.model('banners', bannerSchema);

export default bannerModel;
