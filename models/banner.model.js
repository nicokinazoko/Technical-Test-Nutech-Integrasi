const mongoose = require('mongoose');

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
  },
  {
    timestamps: true,
  }
);

const bannerModel = mongoose.model('banners', bannerSchema);

export default bannerModel;
