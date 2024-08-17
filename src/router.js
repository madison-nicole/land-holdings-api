import { Router } from 'express';
import * as Owners from './controllers/owner_controller';
import * as Land from './controllers/land_controller';
import * as User from './controllers/user_controller';
// import signS3 from './services/s3';

const router = Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to our owners and land holding API!' });
});

router.get('/users', requireAuth, async (req, res) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    console.log('error');
    res.status(422).send({ error: error.toString() });
  }
});

router.route('/users/:username')
  .get(async (req, res) => {
    try {
      const { username } = req.params;
      const user = await UserController.isUsernameTaken(username);
      if (user) {
        res.json(user);
      } else {
        res.status(404).send('User not found');
      }
    } catch (error) {
      res.status(422).send({ error: error.toString() });
    }
  })
  .put(requireAuth, async (req, res) => {
    try {
      const { username } = req.params;
      const { user } = req.body;
      const newUser = await User.updateUser(username, user);
      res.json(newUser);
    } catch (error) {
      console.log(error);
      res.status(422).send({ error: error.toString() });
    }
  });

router.route('/:username/games')
  // fetch games
  .get(async (req, res) => {
    const { username } = req.params;

    try {
      const result = await User.getGames(username);
      return res.json(result);
    } catch (error) {
      // if games not found
      return res.status(404).json({ error: error.message });
    }
  })
  // log a game for the user
  .post(requireAuth, async (req, res) => {
    // store game data
    const { username } = req.params;
    const { game } = req.body;
    const review = req.body?.review;

    try {
      const { user, game: newGame } = await User.saveGame(username, game, review);
      return res.json({ user, newGame });
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  // delete a game for the user
  .delete(requireAuth, async (req, res) => {
    // store game data
    const { username } = req.params;
    const { gameId } = req.body;

    try {
      const user = await User.deleteGame(username, gameId);
      return res.json(user);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
// update a game for the user
  .put(requireAuth, async (req, res) => {
    // store game data
    const { username } = req.params;
    const { game } = req.body;
    const review = req.body?.review;

    try {
      const user = await User.updateGame(username, game, review);
      return res.json(user);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

router.route('/owners')
// fetching owners
  .get(requireAuth, async (req, res) => {
    // use req.body etc to await some contoller function
    // send back the result
    // or catch the error and send back an error
    try {
      const result = await Owners.getOwners();
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  .post(requireAuth, async (req, res) => {
    const fields = req.body;
    try {
      const result = await Owners.createOwner(fields);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

router.route('/owners/:ownerName')
  .get(requireAuth, async (req, res) => {
    const { ownerName } = req.params;
    try {
      const result = await Owners.getOwner(ownerName);
      if (!result) {
        return res.status(404).json({ error: 'Owner not found' });
      }
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  })
  .put(requireAuth, async (req, res) => {
    const { ownerName } = req.params;
    const fields = req.body;
    try {
      const result = await Owners.updateOwner(ownerName, fields);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  .delete(requireAuth, async (req, res) => {
    const { ownerName } = req.params;
    try {
      const result = await Owners.deleteOwner(ownerName);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

router.route('/landHoldings')
// fetching land holdings
  .get(requireAuth, async (req, res) => {
    // use req.body etc to await some contoller function
    // send back the result
    // or catch the error and send back an error
    try {
      const result = await Land.getLandHoldings();
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  .post(requireAuth, async (req, res) => {
    const fields = req.body;
    try {
      const result = await Land.createLandHolding(fields);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

router.route('/landHoldings/:name')
  .get(requireAuth, async (req, res) => {
    const { name } = req.params;
    try {
      const result = await Land.getLandHolding(name);
      if (!result) {
        return res.status(404).json({ error: 'Land holding not found' });
      }
      return res.json(result);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  })
  .put(requireAuth, async (req, res) => {
    const { name } = req.params;
    const fields = req.body;
    try {
      const result = await Land.updateLandHolding(name, fields);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  })
  .delete(requireAuth, async (req, res) => {
    const { name } = req.params;
    try {
      const result = await Land.deleteLandHolding(name);
      return res.json(result);
    } catch (error) {
      return res.status(422).json({ error: error.message });
    }
  });

// router.get('/sign-s3', signS3);

export default router;
