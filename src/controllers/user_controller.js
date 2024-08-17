// import dotenv from 'dotenv';
// import UserModel from '../models/user_model';

// dotenv.config({ silent: true });

// export const isUsernameTaken = async (username) => {
//   const usernameTaken = await UserModel.findOne({ username });
//   return usernameTaken;
// };

// export const isEmailTaken = async (email) => {
//   const emailTaken = await UserModel.findOne({ email });
//   return emailTaken;
// };

// // fetch a user's info
// export async function getUser(username) {
//   // Validate inputs
//   if (!username) {
//     throw new Error('You must provide a username');
//   }

//   let user;

//   // Find user
//   try {
//     user = await UserModel.findOne({ username });
//     return user;
//   } catch (error) {
//     throw new Error(`User not found: ${error}`);
//   }
// }

// // update user
// export async function updateUser(username, newUser) {
//   // Validate inputs
//   if (!newUser || !username) {
//     throw new Error('You must provide a user and username');
//   }

//   let user;

//   // Find user
//   try {
//     user = await UserModel.findOne({ username });
//   } catch (error) {
//     throw new Error(`User not found: ${error}`);
//   }

//   // update fields
//   user.username = newUser.username;
//   user.bio = newUser.bio;
//   user.website = newUser.website;
//   user.socials = newUser.socials;

//   try {
//     await user.save();
//     return user;
//   } catch (error) {
//     throw new Error(`save user error: ${error}`);
//   }
// }

// export async function saveAvatar(username, url) {
//   // Validate inputs
//   if (!username || !url) {
//     throw new Error('You must provide a username and avatar URL');
//   }

//   let user;

//   // Find user
//   try {
//     user = await UserModel.findOne({ username });
//   } catch (error) {
//     throw new Error(`finding username error ${error}`);
//   }

//   if (!user) {
//     throw new Error('User not found');
//   }

//   // Store the new avatar url in the user model
//   user.avatarUrl = url;

//   try {
//     await user.save();
//   } catch (error) {
//     throw new Error(`save user avatar error: ${error}`);
//   }
// }

// export async function saveGame(username, game, review = null) {
//   // Validate inputs
//   if (!username || !game) {
//     throw new Error('You must provide username and game');
//   }

//   let user;

//   // Find user
//   try {
//     user = await UserModel.findOne({ username });
//   } catch (error) {
//     throw new Error(`finding username error ${error}`);
//   }

//   if (!user) {
//     throw new Error('User not found');
//   }

//   if (!user.games) {
//     user.games = {};
//   }

//   // Spread operator to allow for multiple saved games
//   const newGames = { ...user.games };
//   // Save game review for user
//   newGames[game.id] = review;
//   user.games = newGames;

//   try {
//     console.log('saving');
//     await user.save();
//   } catch (error) {
//     console.log('error in saving game');
//     throw new Error(`save user error: ${error}`);
//   }

//   let existingGame;
//   // If the game exists already, return
//   try {
//     existingGame = await GameModel.findOne({ id: game.id });
//   } catch (error) {
//     throw new Error(`finding existing game error: ${error}`);
//   }

//   if (existingGame) {
//     return { user, game: existingGame };
//   }

//   // Otherwise save the new game and return it
//   const newGame = new GameModel();
//   newGame.id = game.id;
//   newGame.name = game.name;
//   newGame.coverUrl = game.coverUrl;
//   newGame.summary = game.summary;
//   newGame.releaseYear = game.releaseYear;
//   newGame.avgRating = game.avgRating;

//   try {
//     await newGame.save();
//     return { user, game: newGame };
//   } catch (error) {
//     throw new Error(`save game error: ${error}`);
//   }
// }

// // fetch a user's saved games
// export async function getGames(username) {
//   // Validate inputs
//   if (!username) {
//     throw new Error('You must provide a username');
//   }

//   let user;

//   // Find user
//   try {
//     user = await UserModel.findOne({ username });
//     console.log(user);
//   } catch (error) {
//     throw new Error(`User not found: ${error}`);
//   }

//   if (!user.games) {
//     return {};
//   }

//   // Fetch the game IDs
//   const gameIDs = Object.keys(user.games);

//   // Query for game data
//   try {
//     const games = await GameModel.find({ id: { $in: gameIDs } });
//     return games;
//   } catch (error) {
//     throw new Error('Games not found');
//   }
// }

// // delete a user's saved game
// export async function deleteGame(username, gameId) {
//   // await deleting a post
//   // return confirmation
//   // Validate inputs
//   if (!username || !gameId) {
//     throw new Error('You must provide username and game');
//   }

//   let user;

//   // Find user
//   try {
//     user = await UserModel.findOne({ username });
//   } catch (error) {
//     throw new Error(`finding username error ${error}`);
//   }

//   if (!user) {
//     throw new Error('User not found');
//   }

//   if (!user.games) {
//     throw new Error('No user games saved');
//   }

//   // Spread operator to allow for multiple saved games
//   const newGames = { ...user.games };
//   // Delete game
//   delete newGames[gameId];
//   user.games = newGames;

//   try {
//     console.log('deleting');
//     await user.save();
//   } catch (error) {
//     console.log('error in deleting game');
//     throw new Error(`save user error: ${error}`);
//   }

//   return user;
// }

// // update a user's saved game
// export async function updateGame(username, game, review) {
// // Validate inputs
//   if (!username || !game) {
//     throw new Error('You must provide username and game');
//   }

//   let user;

//   // Find user
//   try {
//     user = await UserModel.findOne({ username });
//   } catch (error) {
//     throw new Error(`finding username error ${error}`);
//   }

//   if (!user) {
//     throw new Error('User not found');
//   }

//   // Spread operator to allow for multiple saved games
//   const newGames = { ...user.games };
//   // Save game review for user
//   newGames[game.id] = review;
//   user.games = newGames;

//   try {
//     console.log('updating');
//     await user.save();
//   } catch (error) {
//     console.log('error in updating game');
//     throw new Error(`save user error: ${error}`);
//   }

//   return user;
// }
