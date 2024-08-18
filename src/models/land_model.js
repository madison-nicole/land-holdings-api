import mongoose, { Schema } from 'mongoose';

const LandSchema = new Schema({
  name: { type: String },
  ownerName: { type: String, unique: true },
  legalEntity: { type: String },
  mineralAcres: { type: Number },
  royalty: { type: Number },
  sectionName: { type: String },
  section: { type: String },
  township: { type: String },
  range: { type: String },
  titleSource: { type: String },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create LandModel class from schema
const LandModel = mongoose.model('Land', LandSchema);

export default LandModel;
