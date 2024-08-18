import UserModel from '../models/user_model';
import OwnerModel from '../models/owner_model';
import { isAddressTaken, isOwnerTaken } from './owner_controller';

export const isUserTaken = async (userId) => {
  const userTaken = await UserModel.findOne({ userId });
  return userTaken;
};

// Fetch a user
export async function getUser(userId) {
  // Validate inputs
  if (!userId) {
    throw new Error('You must provide a user ID.');
  }

  let user;

  // Find user
  try {
    user = await UserModel.findOne({ userId });
    return user;
  } catch (error) {
    throw new Error(`User not found: ${error}`);
  }
}

export async function createUser(userId, ownerData) {
  // use the User model to create a new user
  const user = new UserModel();
  user.userId = userId;
  user.owners = { ownerData };

  // Save the user
  try {
    await user.save();
    return user;
  } catch (error) {
    throw new Error(`Create user error: ${error}`);
  }
}

export async function saveOwner(userId, ownerData) {
  if (!ownerData || !userId) {
    throw new Error('You must provide the userId and owner data.');
  }

  // See if the user already exists
  const existingUser = await isUserTaken(userId);

  // Create a new user if it doesn't exist
  if (!existingUser) {
    try {
      const user = await createUser(userId, ownerData);
      return user;
    } catch (error) {
      throw new Error(`Create user error: ${error}`);
    }
  }

  // User already exists
  // If no owners exist
  if (!existingUser.owners) {
    existingUser.owners = { ...ownerData };
  }

  // Use the spread operator to allow for multiple saved owners
  // Then save the new owner to the user
  const newOwners = { ...existingUser.owners, ownerData };
  existingUser.owners = newOwners;

  // Check if the owner or address already exist
  const ownerTaken = isOwnerTaken(ownerData.ownerName);
  const addressTaken = isAddressTaken(ownerData.address);

  if (ownerTaken || addressTaken) {
    // If the owner already exists, return an error
    throw new Error('This owner and/or address already exist.');
  }

  // Create a new owner object
  const newOwner = new OwnerModel();

  // Save the fields
  newOwner.ownerName = ownerData.ownerName;
  newOwner.entityType = ownerData.entityType;
  newOwner.ownerType = ownerData.ownerType;
  newOwner.address = ownerData.address;
  newOwner.totalHoldings = ownerData.totalHoldings;
  newOwner.classA = ownerData.classA;
  newOwner.classB = ownerData.classB;
  newOwner.classC = ownerData.classC;
  newOwner.classD = ownerData.classD;
  newOwner.legalEntities = ownerData.legalEntities;
  newOwner.mineralAcres = ownerData.mineralAcres;

  try {
    await newOwner.save();
    return { existingUser, owner: newOwner };
  } catch (error) {
    throw new Error(`Save owner error: ${error}`);
  }
}

export async function getOwners(userId) {
  // Validate inputs
  if (!userId) {
    throw new Error('You must provide a user ID');
  }

  let user;

  // Find user
  try {
    user = await UserModel.findOne({ userId });
    console.log(user);
  } catch (error) {
    throw new Error(`User not found: ${error}`);
  }

  if (!user.owners) {
    return {};
  }

  // Fetch the game IDs
  const ownerNames = Object.keys(user.owners.ownerName);

  // Query for game data
  try {
    const owners = await OwnerModel.find({ ownerName: { $in: ownerNames } });
    return owners;
  } catch (error) {
    throw new Error('Owners not found');
  }
}
