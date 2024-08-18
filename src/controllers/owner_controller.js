import OwnerModel from '../models/owner_model';

export const isOwnerTaken = async (ownerName) => {
  const ownerTaken = await OwnerModel.findOne({ ownerName });
  return ownerTaken;
};

export const isAddressTaken = async (address) => {
  const addressTaken = await OwnerModel.findOne({ address });
  return addressTaken;
};

// export async function getOwners() {
//   // Await finding owners and return them
//   try {
//     const savedOwners = await OwnerModel.find({}).sort({ date: -1 });
//     return savedOwners;
//   } catch (error) {
//     throw new Error(`Retrieve owners error: ${error}`);
//   }
// }
// export async function getOwner(ownerName) {
//   // Await finding one owner and returning it
//   try {
//     const owner = await OwnerModel.findOne({ ownerName });
//     return owner;
//   } catch (error) {
//     throw new Error(`Retrieve owner error: ${error}`);
//   }
// }

// export async function deleteOwner(ownerName) {
//   // Await deleting one owner and receiving confirmation
//   try {
//     const deletedOwner = await OwnerModel.findOneAndDelete({ ownerName });
//     return deletedOwner;
//   } catch (error) {
//     throw new Error(`Delete owner error: ${error}`);
//   }
// }

// export async function updateOwner(ownerName, ownerData) {
//   // Await updating an owner listing and returning the updated version
//   try {
//     await OwnerModel.findOneAndUpdate({ ownerName }, { ...ownerData });
//     const updatedOwner = await OwnerModel.findOne({ ownerName });
//     return updatedOwner;
//   } catch (error) {
//     throw new Error(`Update owner error: ${error}`);
//   }
// }
