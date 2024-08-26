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

  const newLandHoldings = { ...owner.landHoldings };
  newLandHoldings[landHolding.name] = landHolding;
  owner.landHoldings = newLandHoldings;

  // Save this to the specified owner model
  try {
    await owner.save();
  } catch (error) {
    throw new Error(`Save to owner error: ${error}`);
  }

  // Await creating the land holding and saving it
  try {
    await landHolding.save();
    return landHolding;
  } catch (error) {
    throw new Error(`Create land holding error: ${error}`);
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
  let owner;

  try {
    owner = await OwnerModel.findOne({ ownerName });
  } catch (error) {
    throw new Error(`Cannot find owner: ${error}`);
  }

  if (!owner) {
    throw new Error('Owner not found');
  }

  if (owner.userId !== userId) {
    throw new Error('Not authenticated');
  }

  const newLand = { ...owner.landHoldings };
  delete newLand[landName];
  owner.landHoldings = newLand;

  try {
    await owner.save();
  } catch (error) {
    throw new Error(`Delete land holding error: ${error}`);
  }

  return owner;
}

export async function getLandHolding(userId, ownerName, landName) {
  // Await finding the owner
  let owner;

  try {
    owner = await OwnerModel.findOne({ ownerName });
  } catch (error) {
    throw new Error(`Cannot find owner: ${error}`);
  }

  if (!owner) {
    throw new Error('Owner not found');
  }

  if (owner.userId !== userId) {
    throw new Error('Not authenticated');
  }

  let landHolding;

  try {
    landHolding = owner.landHoldings[landName];
  } catch (error) {
    throw new Error(`Retrieve land holding error: ${error}`);
  }

  const landData = {
    name: landHolding.name,
    ownerName: landHolding.ownerName,
    legalEntity: landHolding.legalEntity,
    mineralAcres: landHolding.mineralAcres,
    royalty: landHolding.royalty,
    sectionName: landHolding.sectionName,
    section: landHolding.section,
    township: landHolding.township,
    range: landHolding.range,
    titleSource: landHolding.titleSource,
  };

  return landData;
}

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
