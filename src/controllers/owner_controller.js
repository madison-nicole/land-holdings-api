import OwnerModel from '../models/owner_model';

export const isOwnerTaken = async (ownerName) => {
  const ownerTaken = await OwnerModel.findOne({ ownerName });
  return ownerTaken;
};

export const isAddressTaken = async (address) => {
  const addressTaken = await OwnerModel.findOne({ address });
  return addressTaken;
};

export async function getOwner(ownerName, userId) {
  // Await finding one owner and returning it
  try {
    const owner = await OwnerModel.findOne({ ownerName });

    if (owner.userId !== userId) {
      throw new Error('Not authenticated to view this owner.');
    }

    const ownerData = {
      ownerName: owner.ownerName,
      entityType: owner.entityType,
      ownerType: owner.ownerType,
      address: owner.address,
      totalHoldings: owner.totalHoldings,
      classA: owner.classA,
      classB: owner.classB,
      classC: owner.classC,
      classD: owner.classD,
      legalEntities: owner.legalEntities,
      mineralAcres: owner.mineralAcres,
    };

    return ownerData;
  } catch (error) {
    throw new Error(`Retrieve owner error: ${error}`);
  }
}

export async function deleteOwner(ownerName) {
  // Await deleting one owner and receiving confirmation
  try {
    const deletedOwner = await OwnerModel.findOneAndDelete({ ownerName });
    return deletedOwner;
  } catch (error) {
    throw new Error(`Delete owner error: ${error}`);
  }
}

export async function updateOwner(ownerName, ownerData) {
  // Await updating an owner listing and returning the updated version
  try {
    await OwnerModel.findOneAndUpdate({ ownerName }, { ...ownerData });
    const updatedOwner = await OwnerModel.findOne({ ownerName });
    return updatedOwner;
  } catch (error) {
    throw new Error(`Update owner error: ${error}`);
  }
}
