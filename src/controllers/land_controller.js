import LandModel from '../models/land_model';
import { isOwnerTaken } from './owner_controller';
import { isUserTaken } from './user_controller';

import OwnerModel from '../models/owner_model';

export async function saveLandHolding(userId, ownerName, landData) {
  if (!userId || !ownerName || !landData) {
    throw new Error('You must provide the user ID, owner name, and data.');
  }

  // See if the user already exists
  const existingUser = await isUserTaken(userId);

  if (!existingUser) {
    throw new Error('You must create an owner before adding land.');
  }

  // See if an owner with the given ownerName exists
  const owner = await isOwnerTaken(ownerName);

  if (!owner) {
    // If the owner does not exist, you cannot add a land holding for them.
    // throw new Error('You cannot add a land holding because this owner does not exist.');
    return false;
  }

  // Check that it is the correct user
  if (owner.userId !== userId) {
    throw new Error('This owner belongs to another user.');
  }

  if (!owner.landHoldings) {
    owner.landHoldings = {};
  }

  // If the owner already exists, add this land holding to their listings
  // Create a new land holding object
  const landHolding = new LandModel();

  // Save the fields
  landHolding.userId = userId;
  landHolding.name = landData.name;
  landHolding.ownerName = ownerName;
  landHolding.legalEntity = landData.legalEntity;
  landHolding.mineralAcres = landData.mineralAcres;
  landHolding.royalty = landData.royalty;
  landHolding.sectionName = landData.sectionName;
  landHolding.section = landData.section;
  landHolding.township = landData.township;
  landHolding.range = landData.range;
  landHolding.titleSource = landData.titleSource;

  const newLandHoldings = { ...owner.landHoldings, ...landHolding };
  console.log('newLandHoldings ', newLandHoldings);
  owner.landHoldings = newLandHoldings;

  // Await creating the land holding and saving it
  try {
    await landHolding.save();
  } catch (error) {
    throw new Error(`Create land holding error: ${error}`);
  }

  // Save this to the specified owner model
  try {
    await owner.save();
    return owner;
  } catch (error) {
    throw new Error(`Save to owner error: ${error}`);
  }
}

export async function getOwnersLandHoldings(userId, ownerName) {
  // Await finding one owner and returning it
  try {
    const owner = await OwnerModel.findOne({ ownerName });
    if (owner.userId !== userId) {
      throw new Error('This owner does not belong to this user.');
    }
    return owner.landHoldings;
  } catch (error) {
    throw new Error(`Retrieve owner's land holdings error: ${error}`);
  }
}

export async function deleteLandHolding(userId, ownerName, landName) {
  // Await deleting one owner and receiving confirmation
  try {
    const deletedLandHolding = await LandModel.findOneAndDelete({ name: landName, userId, ownerName });
    return deletedLandHolding;
  } catch (error) {
    throw new Error(`Delete land holding error: ${error}`);
  }
}

// export async function getLandHolding(name) {
//   // Await finding one owner and returning it
//   try {
//     const landHolding = await LandModel.findOne({ name });
//     return landHolding;
//   } catch (error) {
//     throw new Error(`Retrieve land holding error: ${error}`);
//   }
// }

// export async function updateLandHolding(name, landData) {
//   // Await updating an owner listing and returning the updated version
//   try {
//     await LandModel.findOneAndUpdate({ name }, { ...landData });
//     const updatedLandHolding = await LandModel.findOne({ name });
//     return updatedLandHolding;
//   } catch (error) {
//     throw new Error(`Update land holding error: ${error}`);
//   }
// }
