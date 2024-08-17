import OwnerModel from '../models/owner_model';

export const isOwnerTaken = async (ownerName) => {
  const ownerTaken = await OwnerModel.findOne({ ownerName });
  return ownerTaken;
};

export const isAddressTaken = async (address) => {
  const addressTaken = await OwnerModel.findOne({ address });
  return addressTaken;
};

export async function createOwner(ownerData) {
  if (!ownerData) {
    throw new Error('You must provide the owner data.');
  }

  // See if an owner with the given ownerName or address exists
  const ownerTaken = await isOwnerTaken(ownerData.ownerName);
  const addressTaken = await isAddressTaken(ownerData.address);

  if (ownerTaken || addressTaken) {
    // If the owner already exists, return an error
    throw new Error('This owner and/or address already exist.');
  }

  // Create a new owner object
  const owner = new OwnerModel();

  // Save the fields
  owner.ownerName = ownerData.ownerName;
  owner.entityType = ownerData.entityType;
  owner.ownerType = ownerData.ownerType;
  owner.address = ownerData.address;
  owner.totalHoldings = ownerData.totalHoldings;
  owner.classA = ownerData.classA;
  owner.classB = ownerData.classB;
  owner.classC = ownerData.classC;
  owner.classD = ownerData.classD;
  owner.legalEntities = ownerData.legalEntities;
  owner.mineralAcres = ownerData.mineralAcres;

  // Await creating the owner and return that owner
  try {
    const savedOwner = await owner.save();
    return savedOwner;
  } catch (error) {
    throw new Error(`Create owner error: ${error}`);
  }
}

export async function getOwners() {
  // Await finding owners and return them
  try {
    const savedOwners = await OwnerModel.find({}).sort({ date: -1 });
    return savedOwners;
  } catch (error) {
    throw new Error(`Retrieve owners error: ${error}`);
  }
}
export async function getOwner(ownerName) {
  // Await finding one owner and returning it
  try {
    const owner = await OwnerModel.findOne({ ownerName });
    return owner;
  } catch (error) {
    throw new Error(`Retrieve owner error: ${error}`);
  }
}

// export async function deletePost(id) {
//   // Await deleting one owner and receiving confirmation
//   try {
//     const deletedPost = await PostModel.findByIdAndDelete(id);
//     return deletedPost;
//   } catch (error) {
//     throw new Error(`delete post error: ${error}`);
//   }
// }
// export async function updatePost(id, postFields) {
//   // Await updating an owner listing and returning the updated version
//   try {
//     await PostModel.findOneAndUpdate({ _id: id }, { title: postFields.title });
//     const post = await PostModel.findById(id);
//     return post;
//   } catch (error) {
//     throw new Error(`update post error: ${error}`);
//   }
// }
