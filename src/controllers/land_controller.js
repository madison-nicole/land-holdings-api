import LandModel from '../models/land_model';
import { isOwnerTaken } from './owner_controller';

import OwnerModel from '../models/owner_model';

export async function saveLandHolding(landData) {
  if (!landData) {
    throw new Error('You must provide the land holding data.');
  }

  // See if an owner with the given ownerName exists
  const ownerTaken = await isOwnerTaken(landData.ownerName);

  if (!ownerTaken) {
    // If the owner does not exist, you cannot add a land holding for them.
    throw new Error('You cannot add a land holding because this owner does not exist.');
    console.log('owner taken');
  }

  // If the owner already exists, add this land holding to their listings
  // Create a new land holding object
  const landHolding = new LandModel();

  // Save the fields
  landHolding.name = landData.name;
  landHolding.ownerName = landData.ownerName;
  landHolding.legalEntity = landData.legalEntity;
  landHolding.mineralAcres = landData.mineralAcres;
  landHolding.royalty = landData.royalty;
  landHolding.sectionName = landData.sectionName;
  landHolding.section = landData.section;
  landHolding.township = landData.township;
  landHolding.range = landData.range;
  landHolding.titleSource = landData.titleSource;

  // Await creating the land holding and return the holding
  try {
    const savedLandHolding = await landHolding.save();
    return savedLandHolding;
  } catch (error) {
    throw new Error(`Create land holding error: ${error}`);
  }
}

export async function getOwnersLandHoldings(ownerName) {
  // Await finding one owner and returning it
  try {
    const owner = await OwnerModel.findOne({ ownerName });
    return owner.landHoldings;
  } catch (error) {
    throw new Error(`Retrieve owner's land holdings error: ${error}`);
  }
}

export async function getLandHolding(name) {
  // Await finding one owner and returning it
  try {
    const landHolding = await LandModel.findOne({ name });
    return landHolding;
  } catch (error) {
    throw new Error(`Retrieve land holding error: ${error}`);
  }
}

export async function deleteLandHolding(name) {
  // Await deleting one owner and receiving confirmation
  try {
    const deletedLandHolding = await LandModel.findOneAndDelete({ name });
    return deletedLandHolding;
  } catch (error) {
    throw new Error(`Delete land holding error: ${error}`);
  }
}

export async function updateLandHolding(name, landData) {
  // Await updating an owner listing and returning the updated version
  try {
    await LandModel.findOneAndUpdate({ name }, { ...landData });
    const updatedLandHolding = await LandModel.findOne({ name });
    return updatedLandHolding;
  } catch (error) {
    throw new Error(`Update land holding error: ${error}`);
  }
}
