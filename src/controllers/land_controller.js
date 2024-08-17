import LandModel from '../models/land_model';
import { isOwnerTaken } from './owner_controller';

export async function createLandHolding(landData) {
  if (!landData) {
    throw new Error('You must provide the land holding data.');
  }

  // See if an owner with the given ownerName exists
  const ownerTaken = await isOwnerTaken(landData.ownerName);

  if (ownerTaken) {
    // If the owner already exists, add this land holding to their listings
    console.log('owner taken');
  }

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

export async function getLandHoldings() {
  // Await finding land holdings and return them
  try {
    const savedLandHoldings = await LandModel.find({}).sort({ date: -1 });
    return savedLandHoldings;
  } catch (error) {
    throw new Error(`Retrieve land holdings error: ${error}`);
  }
}
export async function getLandHolding(name) {
  // Await finding one land holding and returning it
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
    const landHolding = await LandModel.findOne({ name });
    return landHolding;
  } catch (error) {
    throw new Error(`Update land holding error: ${error}`);
  }
}
