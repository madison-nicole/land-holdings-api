import mongoose, { Schema } from 'mongoose';

const OwnerSchema = new Schema({
//   userPhone: { type: String, unique: true },
  ownerName: { type: String, unique: true },
  entityType: { type: String },
  ownerType: { type: String },
  address: { type: String, unique: true },
  totalHoldings: { type: Number },
  classA: { type: Number },
  classB: { type: Number },
  classC: { type: Number },
  classD: { type: Number },
  legalEntities: { type: Number },
  mineralAcres: { type: Number },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create OwnerModel class from schema
const OwnerModel = mongoose.model('Owner', OwnerSchema);

export default OwnerModel;
