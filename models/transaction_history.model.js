import mongoose from 'mongoose';

const transactionHistorySchema = mongoose.Schema(
  {
    invoice_number: {
      type: String,
      required: true,
    },
    service_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'services',
    },
    transaction_type: {
      type: String,
      enum: ['PAYMENT', 'TOPUP'],
      default: 'PAYMENT',
    },
    total_amount: {
      type: Number,
      default: 0,
    },
    user_id: {
      type: mongoose.Schema.ObjectId,
      ref: 'users',
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

const transactionHistoryModel = mongoose.model(
  'transaction_histories',
  transactionHistorySchema
);

export default transactionHistoryModel;
