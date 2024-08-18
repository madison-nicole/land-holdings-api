import mongoose, { Schema } from 'mongoose';

// create a User schema with email and password fields
const UserSchema = new Schema({
  id: { type: String, unique: true },
  owners: { type: Schema.Types.Mixed, default: {} },
}, {
  toObject: { virtuals: true },
  toJSON: { virtuals: true },
});

// create UserModel class from schema
const UserModel = mongoose.model('User', UserSchema);

export default UserModel;
